"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Copy, Check } from "lucide-react";

interface Props {
  token: string;
}

export function ScanLinkCard({ token }: Props) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const url = `${origin}/scan/${token}`;

  function copyUrl() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Link2 size={16} />
          Scan link
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="break-all font-mono text-xs text-muted-foreground bg-muted rounded-md px-3 py-2">
          {url}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyUrl} className="gap-1.5">
            {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy URL"}
          </Button>
          <p className="text-xs text-muted-foreground">Works for QR codes and RFID tags</p>
        </div>
      </CardContent>
    </Card>
  );
}
