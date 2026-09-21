import { Badge } from "../ui/badge"
import { DialogContent } from "../ui/dialog"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"

function ShoppingOrderDetailsViews({ order }) {
    console.log(order);
    
  return (
   <DialogContent className="sm:max-w-150">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{order?._id}</Label>
          </div>
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{new Date(order?.orderDate).toLocaleDateString()}</Label>
          </div>
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
                 <Badge className={`py-1 px-3 ${order.orderStatus ==="confirmed" ? "bg-green-500": ""}` }>
                     {order?.orderStatus}
                  </Badge>
                </Label>
          </div>
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${Number(order?.totalAmount || 0).toFixed(2)}</Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {order?.cartItem?.map((item) => (
                <li key={item.productId} className="flex items-center justify-between gap-4">
                  <span>{item.title} x {item.quantity}</span>
                  <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground ">
                <span>{order?.addressInfo?.address}</span>
                <span>{order?.addressInfo?.city}</span>
                <span>{order?.addressInfo?.postalCode}</span>
                <span>{order?.addressInfo?.phone}</span>
                <span>{order?.addressInfo?.note}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export default ShoppingOrderDetailsViews