"use server";

import { vocabularyAdminApi, ApiError } from "./api";
import type { VocabularyAdminDto } from "./types";

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
    // plain text
  }
  if (e.status === 403) return "Admin role required.";
  return "Something went wrong. Please try again.";
}

export async function createVocabularyItem(
  _prev: { item: VocabularyAdminDto | null; error: string | null },
  formData: FormData
): Promise<{ item: VocabularyAdminDto | null; error: string | null }> {
  const field = formData.get("field") as string;
  const value = (formData.get("value") as string)?.trim();
  const parentValue = (formData.get("parentValue") as string) || null;
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;

  try {
    const item = await vocabularyAdminApi.create({ field, value, parentValue, sortOrder });
    return { item, error: null };
  } catch (e) {
    return { item: null, error: parseApiError(e) };
  }
}

export async function updateVocabularyItem(
  _prev: { item: VocabularyAdminDto | null; error: string | null },
  formData: FormData
): Promise<{ item: VocabularyAdminDto | null; error: string | null }> {
  const id = parseInt(formData.get("id") as string, 10);
  const value = (formData.get("value") as string)?.trim();
  const parentValue = (formData.get("parentValue") as string) || null;
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;

  try {
    const item = await vocabularyAdminApi.update(id, { id, value, parentValue, sortOrder });
    return { item, error: null };
  } catch (e) {
    return { item: null, error: parseApiError(e) };
  }
}

export async function deleteVocabularyItem(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const id = parseInt(formData.get("id") as string, 10);

  try {
    await vocabularyAdminApi.delete(id);
    return { error: null };
  } catch (e) {
    return { error: parseApiError(e) };
  }
}

export async function deleteVocabularyItemById(id: number): Promise<{ error: string | null }> {
  try {
    await vocabularyAdminApi.delete(id);
    return { error: null };
  } catch (e) {
    return { error: parseApiError(e) };
  }
}
