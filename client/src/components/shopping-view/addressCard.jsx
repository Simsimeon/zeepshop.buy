import { useState } from "react";
import { SquarePen, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";

export default function AddressCard({ handleEditAddress,addressInfo,handleDeleteAddress}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   
  return (
    <Card>
      <CardContent className="grid min-w-0 gap-4 p-2">
        <Label className="wrap-break-word">{addressInfo?.address}</Label>
        <Label className="wrap-break-word">{addressInfo?.city}</Label>
        <Label className="wrap-break-word">{addressInfo?.postalCode}</Label>
        <Label className="wrap-break-word">{addressInfo?.phone}</Label>
        <Label className="wrap-break-word">{addressInfo?.note}</Label>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={()=>handleEditAddress(addressInfo)}>
          <span className="hidden sm:inline-block">edit</span>
          <SquarePen />
        </Button>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger
            render={
              <Button variant="destructive">
                <span className="hidden sm:inline-block">delete</span>
                <Trash />
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this address?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The address will be permanently deleted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteAddress(addressInfo);
                  setIsDeleteDialogOpen(false);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
