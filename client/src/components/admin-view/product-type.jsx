import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

export default function AdminProductType({
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  product,
  handleDeleteProduct
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div className="">
        <div className="relative ">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-75 object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2 mt-2">
            <span
              className={`${product?.salePrice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice && (
              <span className="text-lg font-bold">${product?.salePrice}</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="">{product?.productCreator || "no name"}</div>
          <div className=" w-full flex justify-between items-center">
            <Button onClick={()=>{
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(product._id);
                setFormData(product);
            }}>Edit</Button>
            <Button onClick={()=>handleDeleteProduct(product._id)}>Delete</Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
