import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { toast } from "../ui/toast";
import { useSelector } from "react-redux";

function UserCartWrapper({ cartItem,setOpenCartSheet }) {
  const { products } = useSelector((state) => state.shopProduct);
  const navigate = useNavigate()
  // const { cartItem }= useSelector(state=>state.shopCart)
  const cartItemArray = cartItem.items
  const totalAmount =
    cartItem && cartItemArray?.length > 0
      ? cartItemArray.reduce((sum, currentItem) => {
         return  sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem.price) *
              currentItem?.quantity
   },0 )
      : 0;
    
async function handleCheckOut(getCartItem){
    if (!getCartItem?.items?.length) return;

    const unavailableItem = getCartItem.items.find((item) => {
      const product = products.find(
        (productItem) => productItem._id === item.productId,
      );
      const totalStock = item?.totalStock ?? product?.totalStock ?? 0;
      return Number(item?.quantity) > Number(totalStock);
    });

    if (unavailableItem) {
      const product = products.find(
        (productItem) => productItem._id === unavailableItem.productId,
      );
      const totalStock = unavailableItem?.totalStock ?? product?.totalStock ?? 0;
      toast.add({
        type: "error",
        title: "Stock unavailable",
        description: `${unavailableItem.title} has only ${totalStock} item(s) available.`,
        duration: 3000,
      });
      return;
    }

     navigate("/shop/checkout");
     setOpenCartSheet(false);
       
}      
console.log(cartItem.items,'bbbbbbbbbbbbbbbbb');

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-x-4 px-3">
        {cartItem && cartItem.items?.length > 0
          ? cartItem.items.map((item, i) => (
              <UserCartItemsContent
                key={i}
                cartItem={item}
              />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4 px-2.5">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalAmount}</span>
        </div>
        <Button
        disabled={!cartItemArray?.length}
        onClick={()=>handleCheckOut(cartItem)}
         className="w-full mt-6">checkout</Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
