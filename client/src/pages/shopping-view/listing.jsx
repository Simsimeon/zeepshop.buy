import ProductFilter from "@/components/shopping-view/filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { fetchAllShoppingViewProduct, fetchProductDetails } from "@/store/shop/product-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProductType from "./product-type";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

function createSearchParamsHelpers(filterParams){
  const queryParams =[]
  
  for(const[key,value]of Object.entries(filterParams)){
    if(Array.isArray(value) && value.length > 0){
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
    }
  }
  return queryParams.join("&")
}




function ShoppingListing() {
  const [filter, setFilter] = useState(()=>JSON.parse(sessionStorage.getItem('filter'))||{});
  const [sort, setSort] = useState("price-lowtohigh");
  const dispatch = useDispatch();
  const [searchParams,setSearchParams]=useSearchParams()
  const { products, isLoading, productDetails } = useSelector((state) => state.shopProduct);
   const [openProductDetailsDialog,setOpenProductDetailsDialog] = useState(false);
 
  function handleSort(value) {
   setSort(value); 
  }
  function handleFilter(getSectionId,getCurrentOption){
   console.log(getSectionId,"sectionId");
   console.log(getCurrentOption,"getCurrentOption");
   let copiedFilters = {...filter};
   const indexOfCurrentSection= Object.keys(copiedFilters).indexOf(getSectionId);
   if(indexOfCurrentSection === -1){
      copiedFilters ={
        ...copiedFilters,
        [getSectionId]:[getCurrentOption]
      }  
   }else{
    const indexOfCurrentOption = copiedFilters[getSectionId].indexOf(getCurrentOption)
  if(indexOfCurrentOption === -1){
    copiedFilters[getSectionId].push(getCurrentOption)
  }else{
     copiedFilters[getSectionId].splice(indexOfCurrentOption,1)
  }
  
  
  }
  setFilter(copiedFilters)
   sessionStorage.setItem("filter",JSON.stringify(copiedFilters))
  }
  useEffect(() => {
    if(filter !== null && sort !== null)
    dispatch(fetchAllShoppingViewProduct(
    {  filterParams:filter,
     sortedParams:sort
    }
  ));
  }, [dispatch,sort,filter]);
  useEffect(()=>{
    if(filter && Object.keys(filter).length > 0){
      const createQueryString = createSearchParamsHelpers(filter)
     setSearchParams(new URLSearchParams(createQueryString))
   
    } 
  },[filter,setSearchParams])

  console.log(filter,"filter");
  console.log(searchParams,"searchParams");
  console.log(productDetails,"productDetails");
 async function handleProductDetails (getCurrentProductId){
 console.log(getCurrentProductId);
 const resultAction = await dispatch(fetchProductDetails(getCurrentProductId));
 if (fetchProductDetails.fulfilled.match(resultAction)) {
   setOpenProductDetailsDialog(true);
 }
}
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:p-6">
      <ProductFilter filter={filter} handFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Product</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {products.length} products
            </span>
            <DropdownMenu>
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
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {isLoading ? (
            <p className="col-span-full text-muted-foreground">Loading products...</p>
          ) : products.length > 0 ? (
            products.map((productItem) => (
              <ShoppingProductType handleProductDetails={handleProductDetails} key={productItem._id} product={productItem} />
            ))
          ) : (
            <p className="col-span-full text-muted-foreground">No products found.</p>
          )}
        </div>
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
