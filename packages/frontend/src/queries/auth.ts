import { api } from '@/lib/api-client.';
import type { User } from '@formaire/shared';

export async function sessionQuery(): Promise<User> {
  return api('/auth/me');
}

export async function logoutMutation() {
  return api('/auth/logout', { method: 'POST' });
}
