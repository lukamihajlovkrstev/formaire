import { useMutation, useQuery } from '@tanstack/react-query';
import { createForm, getForms } from '@/queries/forms';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  createFileRoute,
  Outlet,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { LogOut, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { sessionQuery } from '@/queries/auth';
import { getInitials } from '@/lib/utils';
import { OpenContext } from '@/components/providers';
import { queryClient } from '@/lib/query-client';

export const Route = createFileRoute('/_protected/forms')({
  component: FormsLayout,
  loader: async ({ context }) => {
    const queryClient = context.queryClient;

    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['forms'],
        queryFn: getForms,
      }),
      queryClient.ensureQueryData({
        queryKey: ['auth', 'session'],
        queryFn: sessionQuery,
      }),
    ]);
  },
});

function FormsLayout() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const params = useParams({ strict: false });
  const id = params.id as string | undefined;
  const navigate = useNavigate();

  const { data: forms } = useQuery({
    queryKey: ['forms'],
    queryFn: getForms,
  });

  const { data: user } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: sessionQuery,
  });

  const createMutation = useMutation({
    mutationFn: createForm,
    onSuccess: (newForm) => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      setOpen(false);
      navigate({
        to: '/forms/$id',
        params: { id: newForm._id.toString() },
      });
    },
  });

  const create = () => {
    setOpen(false);
    createMutation.mutate({
      title,
    });
  };

  return (
    <OpenContext.Provider value={{ open, setOpen }}>
      <SidebarProvider>
        <Dialog open={open}>
          <DialogContent
            className="sm:max-w-106.25"
            onClose={() => setOpen(false)}
          >
            <DialogHeader>
              <DialogTitle>Name your collection</DialogTitle>
              <DialogDescription>
                This title will be used to organize and group all responses
                submitted to this form.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Title</Label>
                <Input
                  id="name-1"
                  name="name"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={() => setOpen(false)} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" onClick={create}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Sidebar>
          <SidebarHeader>
            <div className="flex gap-2 align-middle my-2">
              <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center ">
                <img src="/logo.svg" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Formaire Inc</span>
                <span className="truncate text-xs">Marketing platform</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup className="py-1">
              <SidebarGroupContent className="flex gap-1 justify-between">
                <div className="relative w-full">
                  <Label htmlFor="search" className="sr-only">
                    Search
                  </Label>
                  <SidebarInput
                    id="search"
                    placeholder="Search the docs..."
                    className="pl-8"
                  />
                  <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                </div>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setOpen(true)}
                >
                  <Plus />
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {forms?.map((x) => (
                    <SidebarMenuItem key={x._id.toString()}>
                      <SidebarMenuButton
                        isActive={x._id.toString() === id}
                        onClick={() =>
                          navigate({
                            to: '/forms/$id',
                            params: { id: x._id.toString() },
                          })
                        }
                      >
                        {x.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex justify-between align-middle p-1 py-1.5">
              <div className="flex gap-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.picture} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
              <Button size="icon-sm" variant="outline">
                <LogOut />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </header>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </OpenContext.Provider>
  );
}
