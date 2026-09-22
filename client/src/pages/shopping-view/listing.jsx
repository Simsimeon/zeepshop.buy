import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import {
  fetchAllShoppingViewProduct,
  fetchProductDetails,
} from "@/store/shop/product-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProductType from "./product-type";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { addToCart, fetchCartItem } from "@/store/shop/cart-slice";
import { toast } from "@/components/ui/toast";
import SearchProduct from "@/components/shopping-view/search-product";
import { clearSearch, searchProducts } from "@/store/search-slice";
import { useRequireAuth } from "@/components/common/use-require-auth";
import { ProductGridSkeleton } from "@/components/common/skeletons";

function createSearchParamsHelpers(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function ShoppingListing() {
  const [sort, setSort] = useState("price-lowtohigh");
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = useMemo(() => {
    const nextFilter = {};
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");

    if (category) nextFilter.category = category.split(",");
    if (brand) nextFilter.brand = brand.split(",");

    return nextFilter;
  }, [searchParams]);
  const { products, isLoading, productDetails } = useSelector(
    (state) => state.shopProduct,
  );
  const {user}=useSelector(state =>state.auth);
  const promptSignIn = useRequireAuth();
  const {
    products: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
    keyword: searchKeyword,
    pagination: searchPagination,
  } = useSelector((state) => state.search);
  const displayedProducts = searchKeyword ? searchResults : products;

  const [openProductDetailsDialog, setOpenProductDetailsDialog] =
    useState(false);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    console.log(getSectionId, "sectionId");
    console.log(getCurrentOption, "getCurrentOption");
    let copiedFilters = {
      ...filter,
      [getSectionId]: [...(filter[getSectionId] || [])],
    };
    const indexOfCurrentSection =
      Object.keys(copiedFilters).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      copiedFilters = {
        ...copiedFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        copiedFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        copiedFilters[getSectionId].push(getCurrentOption);
      } else {
        copiedFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    const queryString = createSearchParamsHelpers(copiedFilters);
    setSearchParams(new URLSearchParams(queryString));
    sessionStorage.setItem("filter", JSON.stringify(copiedFilters));
  }
  useEffect(() => {
    if (filter !== null && sort !== null)
      dispatch(
        fetchAllShoppingViewProduct({
          filterParams: filter,
          sortedParams: sort,
        }),
      );
  }, [dispatch, sort, filter]);


  async function handleProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    const resultAction = await dispatch(
      fetchProductDetails(getCurrentProductId),
    );
    if (fetchProductDetails.fulfilled.match(resultAction)) {
      setOpenProductDetailsDialog(true);
    }
  }
 async function handleAddToCart (getCurrentProductId){
    if (!user?.userId) {
      promptSignIn({
        description: "Sign in to add items to your cart.",
      });
      return;
    }

    const response = await dispatch(addToCart({userId :user.userId,productId:getCurrentProductId,quantity:1}));
    if (addToCart.fulfilled.match(response)) {
       dispatch(fetchCartItem(user.userId));
       toast.add({
         title:"Product is added to cart",
         duration:2000
       })
   }

  }
  return (
   
     
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:p-6">
      <ProductFilter filter={filter} handFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="flex flex-col gap-4 border-b p-4">
          <SearchProduct key={searchKeyword || "all-products"} />
          <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">
            {searchKeyword ? `Search results for "${searchKeyword}"` : "All Products"}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {searchKeyword ? searchPagination.totalItems : products.length} products
            </span>
            {searchKeyword ? (
              <Button variant="outline" onClick={() => dispatch(clearSearch())}>
                View all products
              </Button>
            ) : <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2.5 text-[0.8rem] font-medium hover:bg-muted hover:text-foreground">
                <ArrowUpDownIcon className="h-4 w-4" />
                <span>Sort by</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-50">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                    value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>}
          </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {isLoading || isSearchLoading ? (
            <ProductGridSkeleton count={8} />
          ) : searchError ? (
            <p className="col-span-full text-destructive">{searchError}</p>
          ) : displayedProducts.length > 0 ? (
            displayedProducts.map((productItem) => (
              <ShoppingProductType
              handleProductDetails={handleProductDetails}
              key={productItem._id}
              product={productItem}
              handleAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <p className="col-span-full text-muted-foreground">
              {searchKeyword ? "No products matched your search." : "No products found."}
            </p>
          )}
        </div>
        {searchKeyword && searchPagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 border-t p-4">
            <Button
              variant="outline"
              disabled={searchPagination.currentPage <= 1 || isSearchLoading}
              onClick={() => dispatch(searchProducts({ keyword: searchKeyword, page: searchPagination.currentPage - 1 }))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {searchPagination.currentPage} of {searchPagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={searchPagination.currentPage >= searchPagination.totalPages || isSearchLoading}
              onClick={() => dispatch(searchProducts({ keyword: searchKeyword, page: searchPagination.currentPage + 1 }))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
      <ProductDetailsDialog
        open={openProductDetailsDialog}
        setOpen={setOpenProductDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
