import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/callback')({
  beforeLoad: async () => {
    throw redirect({
      to: '/forms',
    });
  },
});
