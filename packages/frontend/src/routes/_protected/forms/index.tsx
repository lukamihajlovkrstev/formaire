import { OpenContext } from '@/components/providers';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getForms } from '@/queries/forms';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { ListX } from 'lucide-react';
import { useContext } from 'react';

export const Route = createFileRoute('/_protected/forms/')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    const forms = await queryClient.ensureQueryData({
      queryKey: ['forms'],
      queryFn: getForms,
    });

    if (forms.length > 0) {
      const latestForm = forms.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

      throw redirect({
        to: '/forms/$id',
        params: { id: latestForm._id.toString() },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { setOpen } = useContext(OpenContext);

  return (
    <div className="flex w-full h-full">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListX />
          </EmptyMedia>
          <EmptyTitle> No forms yet</EmptyTitle>
          <EmptyDescription>
            Create your first form to start collecting submissions from your
            users.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" onClick={() => setOpen(true)}>
            Create form
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
