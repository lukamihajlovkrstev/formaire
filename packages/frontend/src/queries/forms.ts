import { api } from '@/lib/api-client.';
import type {
  CreateFormInput,
  Form,
  PaginatedSubmissions,
  UpdateFormInput,
} from '@formaire/shared';

export async function getForms(): Promise<Form[]> {
  return api('/forms');
}

export async function createForm(data: CreateFormInput): Promise<Form> {
  return api('/forms', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteForm({ id }: { id: string }): Promise<Form> {
  return api(`/forms/${id}`, { method: 'DELETE' });
}

export async function updateForm({
  id,
  data,
}: {
  id: string;
  data: UpdateFormInput;
}): Promise<Form> {
  return api(`/forms/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function getSubmissions(
  formId: string,
  cursor?: string,
  limit: number = 30,
): Promise<PaginatedSubmissions> {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  if (cursor) {
    params.append('cursor', cursor);
  }

  return api(`/forms/${formId}?${params}`);
}

export async function deleteSubmission({
  formId,
  submissionId,
}: {
  formId: string;
  submissionId: string;
}): Promise<void> {
  await api(`/forms/${formId}/${submissionId}`, {
    method: 'DELETE',
  });

  return;
}
