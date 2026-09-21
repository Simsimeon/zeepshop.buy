import CommonForm from "@/components/common/form";
import { DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "@/store/shop/order-slice";

const initialState={
    status:""
}


export default function AdminOrderDetailsView({ order }) {

    
    const dispatch = useDispatch();

    async function handleUpDateStatus (e){
        e.preventDefault()
      await dispatch(updateOrderStatus({ orderId: order._id, status: formData.status }));
    }
 const [formData ,setFormData]=useState(initialState)
 
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
            <Label>{order?.orderStatus}</Label>
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
        <div className="">
            <CommonForm
            formControls={[
                {
    label:"Order Status",
    name:"status",
    componentType:"select",
    options:[
        {id:"pending",label:"Pending"},
        {id:"process",label:"Processing Order"},
        {id:"confirmed",label:"confirmed"},
        {id:"inShipping",label:"Shipping"},
        {id:"delivered",label:"Delivered"},
        {id:"rejected",label:"Rejected"},   
    ],

}  ]}
formData={formData}
setFormData={setFormData}
buttonText={'Update Order Status '}
onSubmit={handleUpDateStatus}
            />
        </div>
      </div>
    </DialogContent>
  );
}
