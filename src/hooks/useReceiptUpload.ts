"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { validateSlip } from "@/lib/registration";
import { uploadReceipt } from "@/services/receiptService";

export type ReceiptUploadState = {
  file: File | null;
  /** Object key returned by the server once the upload finished. */
  key: string;
  status: "idle" | "uploading" | "done" | "error";
  /** 0-100 of bytes sent. Stays at 100 while the server writes to storage. */
  progress: number;
  error?: string;
};

const IDLE: ReceiptUploadState = { file: null, key: "", status: "idle", progress: 0 };

/** Validates a picked slip, uploads it straight away and tracks progress. Picking another file cancels the previous upload. */
export function useReceiptUpload() {
  const [state, setState] = useState<ReceiptUploadState>(IDLE);
  const abortRef = useRef<(() => void) | null>(null);

  const choose = useCallback((file: File | null) => {
    abortRef.current?.();
    abortRef.current = null;
    if (!file) return setState(IDLE);

    const invalid = validateSlip(file);
    if (invalid) return setState({ file, key: "", status: "error", progress: 0, error: invalid });

    // Updates for a file that is no longer current are ignored
    const patch = (update: Partial<ReceiptUploadState>) => setState((s) => (s.file === file ? { ...s, ...update } : s));
    setState({ file, key: "", status: "uploading", progress: 0 });
    const { promise, abort } = uploadReceipt(file, (progress) => patch({ progress }));
    abortRef.current = abort;
    promise.then(
      (key) => patch({ key, status: "done", progress: 100, error: undefined }),
      (err: unknown) => patch({ status: "error", error: err instanceof Error ? err.message : "Upload failed. Please try again." })
    );
  }, []);

  useEffect(() => () => abortRef.current?.(), []);

  return { ...state, choose, retry: () => choose(state.file) };
}

export type ReceiptUpload = ReturnType<typeof useReceiptUpload>;
