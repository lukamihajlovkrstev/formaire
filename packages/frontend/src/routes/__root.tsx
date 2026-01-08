import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import type { User } from '@formaire/shared';

interface RouterContext {
  auth: {
    isAuthenticated: boolean;
    user: User | null;
  };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
