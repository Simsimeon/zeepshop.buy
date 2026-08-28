import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElement } from "@/config";
import { Fragment, useState } from "react";
import { ProductImageUpload } from "./image-upload";
const initialFormData={
  image:"",
  title:"",
  description:"",
  category:"",
  brand:"",
  price:"",
  salePrice:"",
  totalStock:""
}
export default function AdminProduct() {
  const [formData, setFormData]=useState(initialFormData);
  const [openCreateProductsDialog,setOpenCreateProductsDialog]=useState(false);
  const [imageFile,setImageFile]=useState(null);
  const [uploadedImageUrl,setUploadImageUrl]=useState("")
  function onSubmit (){
    console.log(`submitting`);
    
  }
  
  
  return (
    <Fragment>
    <div className="mb-5 flex justify-end w-full">
       <Button onClick={()=>setOpenCreateProductsDialog(prev=>!prev)}
        className="">Add new product</Button>
    </div>
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">

    </div>
    <Sheet className="" open={openCreateProductsDialog} onOpenChange={()=>
       setOpenCreateProductsDialog(prev=>!prev)
    }>
     <SheetContent side="right" className="px-6 overflow-auto">
      <SheetHeader>
         <SheetTitle>
          Add New Product
         </SheetTitle>
      </SheetHeader>
      <ProductImageUpload 
      file={imageFile} 
      setFile={setImageFile} 
      uploadedImageUrl={uploadedImageUrl} 
      setUploadImageUrl={setUploadImageUrl}/>
      <div className="py-6">
        <CommonForm
        formData={formData}
        buttonText="Add"
        setFormData={setFormData}
          formControls={addProductFormElement}
          onSubmit={onSubmit}
        />
      </div>
     </SheetContent>
    </Sheet>
    </Fragment>
  )
}
