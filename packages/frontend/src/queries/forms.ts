import { api } from '@/lib/api-client.';
import type { CreateFormInput, Form, UpdateFormInput } from '@formaire/shared';

export async function getForms(): Promise<Form[]> {
  return api('/forms');
}

export async function createForm(data: CreateFormInput): Promise<Form> {
  return api('/forms', { method: 'POST', body: JSON.stringify(data) });
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
