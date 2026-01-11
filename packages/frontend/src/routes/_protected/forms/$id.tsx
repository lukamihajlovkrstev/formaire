import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { queryClient } from '@/lib/query-client';
import { deleteSubmission, getSubmissions } from '@/queries/forms';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ListX } from 'lucide-react';

export const Route = createFileRoute('/_protected/forms/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['forms', id],
    queryFn: ({ pageParam }) => getSubmissions(id, pageParam),
    getNextPageParam: (lastPage) => lastPage.meta.next,
    initialPageParam: undefined as string | undefined,
  });

  const deleteSubmissionMutation = useMutation({
    mutationFn: deleteSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', id] });
    },
  });

  const columns = data?.pages[0]?.columns || [];
  const submissions = data?.pages.flatMap((p) => p.submissions) || [];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden isolate">
      <div className="flex-1 min-h-0 overflow-auto relative">
        {submissions.length === 0 ? (
          <div className="flex w-full h-full">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ListX />
                </EmptyMedia>
                <EmptyTitle> No submissions yet</EmptyTitle>
                <EmptyDescription>
                  Configure your website or application to send form data to
                  this endpoint to start collecting responses.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  size="sm"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${import.meta.env.VITE_API_URL}/api/forms/${id}`,
                    )
                  }
                >
                  Copy Form URL
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <Table className="w-max min-w-full border-separate border-spacing-0">
            <TableHeader className="bg-background sticky top-0 z-20">
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-45 bg-background border-b h-12">
                  Timestamp
                </TableHead>
                {columns.map((column) => (
                  <TableHead
                    key={column}
                    className="min-w-37.5 bg-background whitespace-nowrap border-b h-12"
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </TableHead>
                ))}
                <TableHead className="w-25 bg-background border-b h-12 border-l right-0 z-10 sticky"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {submissions.map((sub) => (
                <TableRow key={sub._id?.toString()}>
                  <TableCell className="min-w-45 border-b">
                    {new Date(sub.timestamp).toLocaleString()}
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell
                      key={col}
                      className="min-w-37.5 max-w-75 truncate border-b"
                    >
                      {sub.data[col] !== undefined
                        ? String(sub.data[col])
                        : '-'}
                    </TableCell>
                  ))}
                  <TableCell className="w-25 border-b flex justify-center sticky right-0 z-10 border-l bg-background">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        deleteSubmissionMutation.mutate({
                          formId: id,
                          submissionId: sub._id?.toString() as string,
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
