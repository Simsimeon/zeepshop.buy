import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItem,setOpenCartSheet }) {
  const navigate = useNavigate()
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
        onClick={()=>{navigate("/shop/checkout");
          setOpenCartSheet(false);
         } }
         className="w-full mt-6">checkout</Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
