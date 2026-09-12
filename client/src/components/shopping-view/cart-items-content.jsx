import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";

export default function UserCartItemsContent({ cartItem, onNotify }) {
  console.log(cartItem, "iiii");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({
        userId: user?.userId,
        productId: getCartItem?.productId,
      }),
    );
  }
  console.log(user?.userId, "userrrrrrrrrrrrrrrrrr");
 async function handleUpdateQuantity(getCartItem, typeOfAction) {
   const nextQuantity = typeOfAction === "add"
     ? getCartItem.quantity + 1
     : Math.max(1, getCartItem.quantity - 1);
   const response = await dispatch(
      updateCartQuantity({
        userId: user?.userId,
        productId: getCartItem?.productId,
        quantity: nextQuantity,
      }),
    );
   if (updateCartQuantity.fulfilled.match(response)) {
      onNotify?.("Cart item updated successfully");
   }
  }
  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem.title}</h3>
        <div className="flex items-center mt-1 gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity <= 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "add")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={15}
        />
      </div>
    </div>
  );
}
