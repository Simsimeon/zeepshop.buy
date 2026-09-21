import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

export default function AdminProductType({
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  product,
  handleDeleteProduct,
}) {
  const isOnSale = Number(product?.salePrice) > 0;
  const isOutOfStock = Number(product?.totalStock) <= 0;

  return (
    <Card className="group mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product?.image}
            alt={`${product?.title || "Product"} product image`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant={isOutOfStock ? "destructive" : "secondary"}>
              {isOutOfStock ? "Out of stock" : `${product?.totalStock} in stock`}
            </Badge>
            {isOnSale && <Badge>Sale</Badge>}
          </div>
        </div>
        <CardContent className="flex flex-1 flex-col gap-4 p-4">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold tracking-tight">
              {product?.title.toUpperCase()}
            </h2>
           
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-primary">
                ${isOnSale ? product?.salePrice : product?.price}
              </span>
              {isOnSale && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product?.price}
                </span>
              )}
            </div>
            <span className="text-right text-xs text-muted-foreground">
              {product?.category || "Product"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-border/70 pt-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Stock</p>
              <p className="mt-1 font-medium">{product?.totalStock ?? 0}</p>
            </div>
            <div className="min-w-0 text-right">
              <p className="text-xs text-muted-foreground">Seller</p>
              <p className="mt-1 truncate font-medium">
                {product?.productCreator || "No name"}
              </p>
              </div>
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-2 border-t border-border/70 p-4 pt-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(product._id);
                setFormData(product);
              }}
            >
              <Pencil />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => handleDeleteProduct(product._id)}
            >
              <Trash2 />
              Delete
            </Button>
        </CardFooter>
    </Card>
  );
}
