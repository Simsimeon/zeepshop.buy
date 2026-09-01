import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElement } from "@/config";
import { Fragment, useEffect, useState } from "react";
import { ProductImageUpload } from "./image-upload";
import { useDispatch, useSelector } from "react-redux";
import {
  editProduct,
  addNewProduct,
  fetchAllProduct,
  deleteProduct,
} from "@/store/product-slice";
import { toast } from "@/components/ui/toast";
import AdminProductType from "@/components/admin-view/product-type";
const initialFormData = {
  image: "",
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};
export default function AdminProduct() {
  const [formData, setFormData] = useState(initialFormData);
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.adminProducts);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  async function onSubmit(e) {
    e.preventDefault();
    if (currentEditedId !== null) {
      const editedResponse = await dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        }),
      );
      console.log(editedResponse, "edit");
      if (editedResponse?.payload?.success) {
        dispatch(fetchAllProduct());
        setFormData(initialFormData);
        setOpenCreateProductsDialog(false);
        setCurrentEditedId(null);
      }
      return;
    }
    const response = await dispatch(
      addNewProduct({
        ...formData,
        image: uploadedImageUrl,
      }),
    );
    if (response?.payload?.success) {
      setImageFile(null);
      setFormData(initialFormData);
      dispatch(fetchAllProduct());
      setOpenCreateProductsDialog(false);
      toast.add({
        title: "Product add successfully",
      });
    }

    // console.log(products.data,`submitting`);
  }
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }
 async function handleDeleteProduct(getCurrentProductId){
    console.log(getCurrentProductId);
   const response= await dispatch(deleteProduct({
    id:getCurrentProductId}))
    if (response?.payload?.success) {
        dispatch(fetchAllProduct());
    }
  }
  useEffect(() => {
    dispatch(fetchAllProduct());
  }, [dispatch]);
  console.log(products, "Admin");

  return (
    <Fragment>
      <div className="mb-5 flex justify-end w-full">
        <Button
          onClick={() => setOpenCreateProductsDialog((prev) => !prev)}
          className=""
        >
          Add new product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products && products.length > 0
          ? products.map((productItem, i) => (
              <AdminProductType
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                key={i}
                handleDeleteProduct={handleDeleteProduct}
              />
            ))
          : null}
      </div>
      <Sheet
        className=""
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog((prev) => !prev);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="px-6 overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId === null ? "Add New Product" : "Edit product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageLoading={imageLoading}
            setImageLoading={setImageLoading}
            file={imageFile}
            setFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadImageUrl={setUploadImageUrl}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              formData={formData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              setFormData={setFormData}
              formControls={addProductFormElement}
              onSubmit={onSubmit}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}
