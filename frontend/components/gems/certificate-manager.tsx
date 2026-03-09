"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadCertificate, deleteCertificate } from "@/lib/certificate-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CertificateDto } from "@/lib/types";
import { FileText, Trash2, Plus, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  gemId: string;
  certificates: CertificateDto[];
}

export function CertificateManager({ gemId, certificates }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload state
  const uploadAction = uploadCertificate.bind(null, gemId);
  const [uploadState, uploadFormAction, isUploading] = useActionState(uploadAction, {
    cert: null,
    error: null,
  });

  // Refresh page on successful upload
  useEffect(() => {
    if (uploadState.cert) {
      setShowForm(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    }
  }, [uploadState.cert, router]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText size={16} />
          Certificates
          {certificates.length > 0 && (
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-600">
              {certificates.length}
            </span>
          )}
        </CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? (
            <>
              <ChevronUp size={14} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={14} />
              Add
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Existing certificates */}
        {certificates.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground">No certificates attached yet.</p>
        )}

        {certificates.map((cert) => (
          <CertificateRow key={cert.id} cert={cert} onDeleted={() => router.refresh()} />
        ))}

        {/* Upload form */}
        {showForm && (
          <form action={uploadFormAction} className="flex flex-col gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="certNumber" className="text-xs font-medium">
                  Cert number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="certNumber"
                  name="certNumber"
                  placeholder="e.g. GRS2024-001"
                  required
                  maxLength={100}
                  disabled={isUploading}
                  className="h-8 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="lab" className="text-xs font-medium">Lab</Label>
                <Input
                  id="lab"
                  name="lab"
                  placeholder="e.g. GRS, GIA, Gübelin"
                  maxLength={100}
                  disabled={isUploading}
                  className="h-8 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="grade" className="text-xs font-medium">Grade</Label>
                <Input
                  id="grade"
                  name="grade"
                  placeholder="e.g. No heat, Fine quality"
                  maxLength={50}
                  disabled={isUploading}
                  className="h-8 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="issueDate" className="text-xs font-medium">Issue date</Label>
                <Input
                  id="issueDate"
                  name="issueDate"
                  type="date"
                  disabled={isUploading}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="certFile" className="text-xs font-medium">
                PDF file <span className="text-destructive">*</span>
              </Label>
              <input
                ref={fileInputRef}
                id="certFile"
                name="file"
                type="file"
                accept="application/pdf"
                required
                disabled={isUploading}
                className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-secondary-foreground file:cursor-pointer cursor-pointer"
              />
            </div>

            {uploadState.error && (
              <p className="text-sm text-destructive">{uploadState.error}</p>
            )}

            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={isUploading}>
                {isUploading ? "Uploading…" : "Upload certificate"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function CertificateRow({
  cert,
  onDeleted,
}: {
  cert: CertificateDto;
  onDeleted: () => void;
}) {
  const [deleteState, deleteFormAction, isDeleting] = useActionState(deleteCertificate, {
    error: null,
  });

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-white p-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{cert.certNumber}</span>
          {cert.lab && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {cert.lab}
            </span>
          )}
          {cert.grade && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 border border-emerald-100">
              {cert.grade}
            </span>
          )}
        </div>
        {cert.issueDate && (
          <p className="text-xs text-muted-foreground">
            Issued {new Date(cert.issueDate).toLocaleDateString()}
          </p>
        )}
        {deleteState.error && (
          <p className="text-xs text-destructive mt-1">{deleteState.error}</p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {cert.fileUrl && (
          <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0">
            <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" title="Open PDF">
              <ExternalLink size={13} />
            </a>
          </Button>
        )}
        <form
          action={deleteFormAction}
          onSubmit={(e) => {
            if (
              !window.confirm(
                `Delete certificate "${cert.certNumber}"? This cannot be undone.`
              )
            ) {
              e.preventDefault();
              return;
            }
            // Trigger parent refresh shortly after submission
            setTimeout(onDeleted, 400);
          }}
        >
          <input type="hidden" name="certId" value={cert.id} />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            disabled={isDeleting}
            title="Delete certificate"
          >
            <Trash2 size={13} />
          </Button>
        </form>
      </div>
    </div>
  );
}
