import { useMutation, useQuery } from '@tanstack/react-query';
import { createForm, getForms, updateForm } from '@/queries/forms';
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
  SidebarMenuAction,
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
import { EditIcon, Info, Loader2, LogOut, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { logoutMutation, sessionQuery } from '@/queries/auth';
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
  const [search, setSearch] = useState('');
  const [target, setTarget] = useState<null | string>(null);

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

  const filtered = useMemo(() => {
    if (!forms) return [];

    return forms.filter((form) =>
      form.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, forms]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setTitle('');
        setTarget(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const logout = useMutation({
    mutationFn: logoutMutation,
    onSettled: async () => {
      queryClient.clear();
      navigate({ to: '/login', replace: true });
    },
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

  const updateMutation = useMutation({
    mutationFn: updateForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      setOpen(false);
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isPending) return;

    if (target) {
      updateMutation.mutate({
        id: target,
        data: { title },
      });
    } else {
      createMutation.mutate({ title });
    }
  };

  return (
    <OpenContext.Provider value={{ open, setOpen }}>
      <SidebarProvider>
        <Dialog open={open} onOpenChange={(val) => !isPending && setOpen(val)}>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={submit}>
              <DialogHeader>
                <DialogTitle>
                  {target ? 'Rename collection' : 'Name your collection'}
                </DialogTitle>
                <DialogDescription>
                  This title will be used to organize and group all responses.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-3">
                  <Label htmlFor="form-title">Title</Label>
                  <Input
                    id="form-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title..."
                    disabled={isPending}
                    autoFocus
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isPending}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isPending || !title.trim()}
                  className="min-w-25"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : target ? (
                    'Save changes'
                  ) : (
                    'Create'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Sidebar>
          <SidebarHeader>
            <div className="flex gap-2 align-middle my-2">
              <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center">
                <img src="/logo.svg" alt="Logo" />
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
                  <SidebarInput
                    placeholder="Search forms..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="pl-8"
                  />
                  <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50" />
                </div>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => {
                    setTarget(null);
                    setTitle('');
                    setOpen(true);
                  }}
                >
                  <Plus className="size-4" />
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filtered?.map((x) => (
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
                        <span className="border bg-background shadow-xs px-1 rounded-md">
                          {x.count}
                        </span>
                        <span className="truncate">{x.title}</span>
                      </SidebarMenuButton>
                      <SidebarMenuAction
                        showOnHover
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setTarget(x._id.toString());
                          setTitle(x.title);
                          setOpen(true);
                        }}
                      >
                        <EditIcon className="size-4" />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex justify-between items-center p-1 py-1.5">
              <div className="flex gap-2 items-center min-w-0">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.picture} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user?.name ?? 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight truncate">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs opacity-70">
                    {user?.email}
                  </span>
                </div>
              </div>
              <Button
                size="icon-sm"
                variant="outline"
                onClick={() => logout.mutate()}
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex w-full justify-end">
              <Button variant="ghost" size="icon-sm">
                <Info className="size-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </OpenContext.Provider>
  );
}
