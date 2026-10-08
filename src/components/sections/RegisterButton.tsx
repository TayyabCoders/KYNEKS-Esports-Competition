"use client";

import { useState } from "react";
import { buttonStyles } from "@/components/ui/Button";
import Onboarding from "@/components/ui/Onboarding";
import Icon from "@/components/common/Icon";

/** Hero call-to-action that opens the squad registration card. */
export default function RegisterButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className={buttonStyles({ size: "lg" })}>
        Pre Registration
        <Icon name="arrowRight" className="h-5 w-5 transition-transform duration-normal group-hover:translate-x-1" />
      </button>
      <Onboarding open={open} onClose={() => setOpen(false)} />
    </>
  );
}
