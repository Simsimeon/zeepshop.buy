import { useEffect, useState } from "react";
import { ProductImageUpload } from "./image-upload";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  addHeroImage,
  deleteHeroImage,
  getHeroImages,
} from "@/store/shop/common-slice";
import { Loader2, Trash2 } from "lucide-react";
import { LazyImage } from "@/components/common/lazy-image";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminDashBoard() {
  const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadImageUrl] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
    const { heroImages, isLoading, deletingId, error } = useSelector(
      (state) => state.heroImage,
    );
    const [heroImageToDelete, setHeroImageToDelete] = useState(null);
     const dispatch = useDispatch()

  async function handleDeleteHeroImage(heroImageId) {
    const response = await dispatch(deleteHeroImage(heroImageId));

    if (deleteHeroImage.fulfilled.match(response)) {
      toast.add({ title: "Hero image deleted", duration: 2000 });
      return;
    }

    toast.add({
      type: "error",
      title: "Delete failed",
      description: response.payload || "Unable to delete hero image",
      duration: 4000,
    });
  }
  
   async function handleUploadHeroImage(){
       setImageLoading(true)

    try{
       
      const response=  await dispatch(addHeroImage(uploadedImageUrl));
           console.log(response);
           setImageLoading(false)
           setUploadImageUrl("")
           setImageFile(null)
    }catch(err){
      console.log(err.message);
      
    }finally{
       setImageLoading(false)
    }
  }
  useEffect(()=>{
    dispatch(getHeroImages())
  },[dispatch])
  console.log(heroImages);
  
  return (
    <div>
                 <ProductImageUpload
                  imageLoading={imageLoading}
                  setImageLoading={setImageLoading}
                  file={imageFile}
                  setFile={setImageFile}
                  uploadedImageUrl={uploadedImageUrl}
                  setUploadImageUrl={setUploadImageUrl}
                  // isEditMode={currentEditedId !== null}
                  isCustomStyling ={true}
                />
           
                <Button
                onClick={handleUploadHeroImage}
                 className="mt-5 w-full">
                  {
                 imageLoading ? 
                <>
              <Loader2 className="size-4 animate-spin" />
              Loading...
            </>:(
              "Upload"
            )
                 
                  }
                 </Button>
        <div className="mt-6 flex flex-col gap-6">
          {error && <p className="text-sm text-destructive">{error}</p>}

          {!isLoading && heroImages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No hero images yet. Upload one to show it on the home page.
            </p>
          )}

          {heroImages.map((eachImage) => {
            return (
              <div
                key={eachImage._id}
                className="overflow-hidden rounded-lg border"
              >
                <LazyImage
                  src={eachImage.image}
                  alt="Hero image"
                  className="h-60 w-full object-cover"
                />
                <div className="flex justify-end p-3">
                  <Button
                    variant="destructive"
                    onClick={() => setHeroImageToDelete(eachImage._id)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <Dialog
          open={Boolean(heroImageToDelete)}
          onOpenChange={(open) => {
            if (!open) setHeroImageToDelete(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this hero image?</DialogTitle>
              <DialogDescription>
                It will be removed from the home page carousel. This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button
                variant="destructive"
                disabled={
                  Boolean(heroImageToDelete) && deletingId === heroImageToDelete
                }
                onClick={async () => {
                  await handleDeleteHeroImage(heroImageToDelete);
                  setHeroImageToDelete(null);
                }}
              >
                {Boolean(heroImageToDelete) &&
                deletingId === heroImageToDelete ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  )
}
