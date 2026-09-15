import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";

function SHoppingCheckout() {
  const { cartItem } = useSelector((state) => state.shopCart);
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
    <div className="flex flex-col">
      <div className="relative h-75 w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="container mx-auto grid grid-cols-2 gap-8 p-5">
        <Address />
        <div className="flex flex-col gap-4">
          {cartItem?.items?.length > 0
            ? cartItem.items.map((item) => (
                <UserCartItemsContent
                  key={item._id || item.productId}
                  cartItem={item}
                />
              ))
            : null}
            <div className="mt-8 space-y-4 px-2.5">
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">${totalAmount}</span>
          </div>
        </div>
        <div className="mt-4 w-full">
          <Button className="w-full p-6">Checkout with Paypal</Button>
        </div>
        </div>      
      </div>
    </div>
  );
}

export default SHoppingCheckout;
