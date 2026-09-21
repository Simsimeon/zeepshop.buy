import { Button } from "@/components/ui/button";
import bannerOne from "../../../src/assets/banner-1.webp";
import bannerTwo from "../../../src/assets/banner-2.webp";
import bannerThree from "../../../src/assets/banner-3.webp";
import {
  BabyIcon,
  CatIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Grid3X3Icon,
  ShirtIcon,
  SparklesIcon,
  TagIcon,
  Umbrella,
  WatchIcon,
  ZapIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllShoppingViewProduct, fetchProductDetails } from "@/store/shop/product-slice";
import ShoppingProductType from "./product-type";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItem } from "@/store/shop/cart-slice";
import { toast } from "@/components/ui/toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { useRequireAuth } from "@/components/common/use-require-auth";
const slides = [bannerOne, bannerTwo, bannerThree];
const categoriesWithIcons = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: Umbrella },
];
const brandWithIcon = [
  { id: "nike", label: "Nike", icon: ZapIcon },
  { id: "adidas", label: "Adidas", icon: Grid3X3Icon },
  { id: "puma", label: "Puma", icon: CatIcon },
  { id: "levi", label: "Levi", icon: TagIcon },
  { id: "zara", label: "Zara", icon: SparklesIcon },
  { id: "h&m", label: "H&M", icon: ShirtIcon },
];
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products,productDetails } = useSelector((state) => state.shopProduct);
  const [openProductDetailsDialog,setOpenProductDetailsDialog]=useState(false)
  const { user } = useSelector((state) => state.auth);
  const promptSignIn = useRequireAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((pervSlice) => (pervSlice + 1) % slides.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllShoppingViewProduct({
        filterParams: {},
        sortedParams: "price-lowtohigh",
      }),
    );
  }, [dispatch]);
  function handleNavigateToListPage(getCurrentItem, section) {
    sessionStorage.removeItem("filter");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filter", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }
function handleGetProductDetails (getCurrentProductId){
  dispatch(fetchProductDetails(getCurrentProductId))
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
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-150 overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-2000`}
          />
        ))}
        <Button
          variant="outline"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + slides.length) % slides.length,
            )
          }
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-col-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcons.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListPage(categoryItem, "category")
                }
                key={categoryItem.id}
                className={`cursor-pointer hover:shadow-lg transition-shadow`}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Bands</h2>
          <div className="grid grid-cols-2 md:grid-col-3 lg:grid-cols-6 gap-4">
            {brandWithIcon.map((brandItem) => (
              <Card
               onClick={() =>
                  handleNavigateToListPage(brandItem, "brand")
                }
                key={brandItem.id}
                className={`cursor-pointer hover:shadow-lg transition-shadow`}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products && products.length > 0
              ? products
                  .slice(0, 4)
                  .map((productItem, i) => (
                    <ShoppingProductType
                    handleAddToCart={handleAddToCart}
                    handleProductDetails={handleGetProductDetails}
                    key={i} product={productItem} />
                  ))
              : null}
          </div>
        </div>
      </section>
       <ProductDetailsDialog
        open={openProductDetailsDialog}
        setOpen={setOpenProductDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
