import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/forms/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return <></>;
}
