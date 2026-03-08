"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  token: string;
  name: string;
}

export function QrCodeButton({ token, name }: Props) {
  const [open, setOpen] = useState(false);
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/scan/${token}`;

  function downloadSvg() {
    const svg = document.querySelector("#qr-svg-export svg") as SVGElement | null;
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name.replace(/\s+/g, "-").toLowerCase()}-qr.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <QrCode size={14} />
        QR Code
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="relative flex flex-col items-center gap-5 rounded-xl border bg-card p-7 shadow-2xl w-[320px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X size={15} />
        </button>

        <div>
          <h3 className="text-center font-semibold">{name}</h3>
          <p className="text-center text-xs text-muted-foreground mt-0.5">Scan to view gem details</p>
        </div>

        <div id="qr-svg-export" className="rounded-lg bg-white p-4 shadow-inner">
          <QRCodeSVG
            value={url}
            size={200}
            level="M"
            includeMargin={false}
          />
        </div>

        <p className="text-[10px] text-muted-foreground text-center break-all max-w-full">{url}</p>

        <Button size="sm" variant="outline" onClick={downloadSvg} className="w-full">
          <Download size={13} />
          Download SVG
        </Button>
      </div>
    </div>
  );
}
