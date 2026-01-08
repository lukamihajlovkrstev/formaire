import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/forms')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/forms"!</div>;
}
