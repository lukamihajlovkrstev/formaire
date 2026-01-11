import type { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface AnalyticsDialogProps {
  formId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function AnalyticsDialog({
  formId,
  open,
  setOpen,
}: AnalyticsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogContent className="sm:max-w-md">
        <form>
          <DialogHeader>
            <DialogTitle>Additional details</DialogTitle>
            <DialogDescription>
              This title will be used to organize and group all responses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="form-title">Title</Label>
              <Input id="form-title" placeholder="Enter title..." autoFocus />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button className="min-w-25" type="button" variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
