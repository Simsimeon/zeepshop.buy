import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export function ProductImageUpload({
  isEditMode,
  imageLoading,
  setImageLoading,
  file,
  setFile,
  uploadedImageUrl,
  setUploadImageUrl,
}) {
  const inputRef = useRef(null);
  function handleImageFileChange(e) {
    console.log(e.target.files);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  }
  function handleDragOver(e) {
    e.preventDefault();
  }
  function handleDrop(e) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  }
  function handleRemoveFile() {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }
  useEffect(() => {
    async function uploadedImageToCloudinary() {
      try {
        setImageLoading(true);

        const data = new FormData();
        data.append("my_filez", file);
        const response = await axios.post(
          "http://localhost:5000/api/admin/products/upload-product-image",
          data,
        );
        if (response.data.success) {
          setUploadImageUrl(response.data.result.url);
          console.log(response.data.result.url);
          setImageLoading(false);
        }
      } catch (error) {
        setImageLoading(false);
        console.log(error.message);
      }
    }
    if (file !== null) uploadedImageToCloudinary();
  }, [file, setUploadImageUrl, setImageLoading]);

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <Label className="text-lg  font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? "opacity-60": "" } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!file ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode ? "cursor-not-allowed":""} flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoading ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between ">
            <div className="flex items-center">
              <FileIcon className="w-7 h-8 text-primary mr-1" />
            </div>
            <p className="text-sm font-medium">{file.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveFile}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr"></span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
