type UploadResponse = { fileKey?: string; error?: string };

/** Uploads a payment slip to /api/upload. XHR (not fetch) because fetch can't report upload progress. */
export function uploadReceipt(file: File, onProgress: (percent: number) => void): { promise: Promise<string>; abort: () => void } {
  const xhr = new XMLHttpRequest();

  const promise = new Promise<string>((resolve, reject) => {
    xhr.open("POST", "/api/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let parsed: UploadResponse | null = null;
      try {
        parsed = JSON.parse(xhr.responseText) as UploadResponse;
      } catch {
        // non-JSON response (proxy error page): fall through to the generic message
      }
      if (xhr.status >= 200 && xhr.status < 300 && parsed?.fileKey) resolve(parsed.fileKey);
      else reject(new Error(parsed?.error ?? "Upload failed. Please try again."));
    };
    xhr.onerror = () => reject(new Error("Couldn't reach the server. Check your connection and try again."));
    xhr.onabort = () => reject(new DOMException("Upload cancelled", "AbortError"));

    const body = new FormData();
    body.append("file", file);
    xhr.send(body);
  });

  return { promise, abort: () => xhr.abort() };
}
