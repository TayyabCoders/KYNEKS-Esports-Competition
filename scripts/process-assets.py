"""Builds web-ready assets from public/images/raw.

  python scripts/process-assets.py            # everything
  python scripts/process-assets.py logo       # logo + icon + favicons only
  python scripts/process-assets.py characters # character cutouts only

Needs: pillow numpy rembg[cpu]
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "assets-src"  # originals, kept out of /public so they are never served
OUT = ROOT / "public" / "images"
APP = ROOT / "src" / "app"


def light_on_dark_to_alpha(img: Image.Image, floor: int = 34) -> Image.Image:
    """Drop the black backdrop of a light-on-dark logo, keeping edges soft.

    alpha = brightest channel (above a noise floor), colour is un-premultiplied
    so white stays white, purple stays purple, lime stays lime.
    """
    a = np.asarray(img.convert("RGB"), dtype=np.float32)
    m = a.max(axis=2)
    alpha = np.clip((m - floor) / (255 - floor), 0, 1)
    rgb = np.where(m[..., None] > 0, a / np.maximum(m[..., None], 1) * 255, 0)
    out = np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def trim(img: Image.Image, pad: int = 0) -> Image.Image:
    box = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if not box:
        return img
    l, t, r, b = box
    return img.crop((max(l - pad, 0), max(t - pad, 0), min(r + pad, img.width), min(b + pad, img.height)))


def save_both(img: Image.Image, name: str, **webp_kw) -> None:
    img.save(OUT / f"{name}.png", optimize=True)
    img.save(OUT / f"{name}.webp", quality=90, method=6, **webp_kw)


def logo() -> None:
    src = Image.open(RAW / "logo.jpg")
    # Region that contains only the mark, wordmark and tagline (no glows/streaks)
    full = trim(light_on_dark_to_alpha(src.crop((250, 190, 790, 880))), pad=6)
    # Remove leftovers of the photo's light streak (top-right) and purple corner glow (bottom-left)
    a = full.getchannel("A")
    a.paste(0, (482, 0, full.width, 600))
    a.paste(0, (0, 630, 14, full.height))
    full.putalpha(a)
    full = trim(full, pad=6)
    save_both(full, "kyneks-logo")

    icon = trim(light_on_dark_to_alpha(src.crop((290, 190, 750, 665))), pad=4)
    a = icon.getchannel("A")
    a.paste(0, (315, 140, icon.width, 260))  # stray streak fragment right of the K
    icon.putalpha(a)
    icon = trim(icon, pad=4)
    save_both(icon, "kyneks-icon")

    # Favicon / app icons: icon centred on a dark rounded tile
    for size, name in ((512, "icon-512.png"), (192, "icon-192.png"), (180, "apple-icon.png"), (32, "icon.png")):
        tile = Image.new("RGBA", (size, size), (11, 11, 14, 255))
        k = icon.copy()
        k.thumbnail((int(size * 0.66), int(size * 0.66)), Image.LANCZOS)
        tile.alpha_composite(k, ((size - k.width) // 2, (size - k.height) // 2))
        target = APP / name if name in ("icon.png", "apple-icon.png") else OUT / name
        tile.convert("RGB").save(target, optimize=True)
    print("logo ok", full.size, icon.size)


def characters() -> None:
    from rembg import new_session, remove

    session = new_session("isnet-general-use")
    jobs = {
        "trooper": (2.0, 900),   # low-res source -> upscale a bit
        "girl": (1.6, 900),
        "operator": (1.0, 1100),
    }
    for name, (scale, max_h) in jobs.items():
        src = Image.open(RAW / f"{name}.jpg").convert("RGB")
        if name == "trooper":
            # Cover the stock-site watermark on the belt by cloning the texture just below it
            box = (274, 260, 342, 271)
            patch = src.crop((box[0], box[1] + 11, box[2], box[3] + 11)).filter(ImageFilter.GaussianBlur(0.8))
            src.paste(patch, box)
        if scale != 1:
            src = src.resize((int(src.width * scale), int(src.height * scale)), Image.LANCZOS)
        cut = remove(src, session=session)
        # Floor faint halo pixels (neon particles, soft matte fringe) so glows/shadows hug the character
        alpha = np.asarray(cut.getchannel("A"), dtype=np.float32)
        alpha = np.clip((alpha - 48) / (255 - 48), 0, 1) * 255
        cut.putalpha(Image.fromarray(alpha.astype(np.uint8)))
        cut = trim(cut, pad=4)
        if cut.height > max_h:
            cut = cut.resize((int(cut.width * max_h / cut.height), max_h), Image.LANCZOS)
        cut.save(OUT / f"char-{name}.webp", quality=88, method=6)
        print("char", name, cut.size)


def og() -> None:
    """1200x630 social share card: dark canvas, lime/purple light, logo, tagline."""
    from PIL import ImageDraw

    W, H = 1200, 630
    canvas = Image.new("RGBA", (W, H), (11, 11, 14, 255))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(glow)
    d.ellipse((760, -320, 1500, 420), fill=(192, 254, 0, 70))
    d.ellipse((-420, 300, 460, 980), fill=(108, 19, 236, 120))
    canvas.alpha_composite(glow.filter(ImageFilter.GaussianBlur(110)))

    logo_img = Image.open(OUT / "kyneks-logo.png").convert("RGBA")
    logo_img.thumbnail((520, 470), Image.LANCZOS)
    canvas.alpha_composite(logo_img, (W // 2 - logo_img.width // 2 - 260, 80))

    for name, x, w in (("char-operator", 800, 380),):
        c = Image.open(OUT / f"{name}.webp").convert("RGBA")
        c.thumbnail((w, 560), Image.LANCZOS)
        canvas.alpha_composite(c, (x, H - c.height - 20))
    canvas.convert("RGB").save(OUT / "og.jpg", quality=88)
    print("og ok")


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    if which in ("all", "logo"):
        logo()
    if which in ("all", "characters"):
        characters()
    if which in ("all", "og"):
        og()
