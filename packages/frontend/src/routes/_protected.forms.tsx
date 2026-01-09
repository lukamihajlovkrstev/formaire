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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { createFileRoute } from '@tanstack/react-router';
import { LogOut, Plus, Search } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_protected/forms')({
  component: RouteComponent,
});

function RouteComponent() {
  const [open, setOpen] = useState(false);

  return (
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
                defaultValue="Example collection"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => setOpen(false)} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={() => setOpen(false)}>
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
                <SidebarMenuItem>
                  <SidebarMenuButton>Hello there</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Hello there</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Hello there</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex justify-between align-middle p-1 py-1.5">
            <div className="flex gap-2">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="" alt="" />
                <AvatarFallback className="rounded-lg">LK</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  Luka Krstev Mihajlov
                </span>
                <span className="truncate text-xs">arrianaire@elfak.rs</span>
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
      </SidebarInset>
    </SidebarProvider>
  );
}
