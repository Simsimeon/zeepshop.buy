import { ArrowRight, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { brandsOptionsMap, categoryOptionsMap } from "@/config";
import { LazyImage } from "@/components/common/lazy-image";

function ShoppingProductType({ product, handleProductDetails, handleAddToCart }) {
    const isOnSale = Number(product?.salePrice) > 0;
    const isOutOfStock = Number(product?.totalStock) <= 0;
    const brand = brandsOptionsMap[product?.Brand] || product?.Brand;
    const category = categoryOptionsMap[product?.category] || product?.category;

    return (
        <Card className="group mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
            <button
                type="button"
                className={`relative aspect-4/3 w-full overflow-hidden bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
                    isOutOfStock ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={isOutOfStock}
                onClick={() => handleProductDetails(product?._id)}
                aria-label={isOutOfStock ? `${product?.title} is out of stock` : `View details for ${product?.title}`}
            >
                <LazyImage
                    src={product?.image}
                    alt={`${product?.title || "Product"} product image`}
                    className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] ${
                        isOutOfStock ? "opacity-60 grayscale-20" : ""
                    }`}
                />
                <div className="absolute left-3 top-3 flex gap-2">
                    {isOnSale && !isOutOfStock && <Badge>Sale</Badge>}
                    {isOutOfStock && (
                        <Badge variant="destructive">Out of stock</Badge>
                    )}
                </div>
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
                        <span className="rounded-full bg-background/95 px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
                            Currently unavailable
                        </span>
                    </div>
                )}
                {!isOutOfStock && (
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                        View details <ArrowRight className="size-3" />
                    </span>
                )}
            </button>
            <CardContent className="flex flex-1 flex-col gap-4 p-4">
                <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold tracking-tight">
                        {product?.title}
                    </h2>
                    <div className="mt-1 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                        <span className="truncate">{brand || "Unbranded"}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{category || "Uncategorized"}</span>
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className={`text-lg font-semibold ${isOutOfStock ? "text-muted-foreground" : "text-primary"}`}>
                        ${isOnSale ? product?.salePrice : product?.price}
                    </span>
                    {isOnSale && !isOutOfStock && (
                        <span className="text-sm text-muted-foreground line-through">
                            ${product?.price}
                        </span>
                    )}
                </div>
            </CardContent>
            <CardFooter className="border-t border-border/70 p-4 pt-3">
                <Button
                    onClick={() => handleAddToCart(product?._id)}
                    className="w-full"
                    disabled={isOutOfStock}
                >
                    <ShoppingCart />
                    {isOutOfStock ? "Unavailable" : "Add to cart"}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ShoppingProductType;