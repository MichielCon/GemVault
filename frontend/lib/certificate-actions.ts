"use server";

import { cookies } from "next/headers";
import { ApiError } from "./api";
import type { CertificateDto } from "./types";

function baseUrl() {
  return (
    process.env.INTERNAL_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:5000"
  );
}

async function authHeader(): Promise<Record<string, string>> {
  const store = await cookies();
  const token = store.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function parseApiError(e: unknown): string {
  if (!(e instanceof ApiError)) return "Something went wrong. Please try again.";

  try {
    const body = JSON.parse(e.message) as {
      title?: string;
      errors?: Record<string, string[]>;
    };
    if (body.errors) {
      const messages = Object.values(body.errors).flat();
      if (messages.length > 0) return messages.join(" ");
    }
    if (body.title) return body.title;
  } catch {
    // plain text body
  }

  if (e.status === 401) return "You must be logged in to do that.";
  if (e.status === 403) return "You do not have permission to do that.";
  if (e.status === 413) return "File is too large.";
  if (e.status === 422) return "Invalid data. Please check your inputs.";
  return "Something went wrong. Please try again.";
}

export async function uploadCertificate(
  gemId: string,
  _prev: { cert: CertificateDto | null; error: string | null },
  formData: FormData
): Promise<{ cert: CertificateDto | null; error: string | null }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { cert: null, error: "Please select a PDF file." };

  const apiForm = new FormData();
  apiForm.append("file", file, file.name);
  const certNumber = formData.get("certNumber") as string;
  const lab = formData.get("lab") as string | null;
  const grade = formData.get("grade") as string | null;
  const issueDate = formData.get("issueDate") as string | null;

  if (certNumber) apiForm.append("certNumber", certNumber);
  if (lab) apiForm.append("lab", lab);
  if (grade) apiForm.append("grade", grade);
  if (issueDate) apiForm.append("issueDate", issueDate);

  try {
    const store = await cookies();
    const token = store.get("access_token")?.value;
    const headers: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const res = await fetch(`${baseUrl()}/api/v1/gems/${gemId}/certificates`, {
      method: "POST",
      headers,
      body: apiForm,
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
    const cert = (await res.json()) as CertificateDto;
    return { cert, error: null };
  } catch (e) {
    return { cert: null, error: parseApiError(e) };
  }
}

export async function deleteCertificate(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const certId = formData.get("certId") as string;

  try {
    const headers: Record<string, string> = {
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/certificates/${certId}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
    return { error: null };
  } catch (e) {
    return { error: parseApiError(e) };
  }
}
