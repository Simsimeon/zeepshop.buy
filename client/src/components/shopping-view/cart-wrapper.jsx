import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { useEffect, useState } from "react";

function UserCartWrapper({ cartItem }) {
  const [notification, setNotification] = useState("");
  const cartItemArray = cartItem.items
  console.log(cartItemArray, "rrtrtrtrttrtrt");
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
      console.log(totalAmount,'itemarray');
      
  useEffect(() => {
    if (!notification) return;

    const timeoutId = setTimeout(() => setNotification(""), 3000);
    return () => clearTimeout(timeoutId);
  }, [notification]);

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      {notification ? (
        <div
          className="mx-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
          role="status"
        >
          {notification}
        </div>
      ) : null}
      <div className="mt-8 space-x-4 px-3">
        {cartItem && cartItem.items?.length > 0
          ? cartItem.items.map((item, i) => (
              <UserCartItemsContent
                key={i}
                cartItem={item}
                onNotify={setNotification}
              />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4 px-2.5">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalAmount}</span>
        </div>
        <Button className="w-full mt-6">checkout</Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
