import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchAllOrders } from "@/store/shop/order-slice";
import AdminOrderDetailsView from "./orderdetails";
import { TableRowsSkeleton } from "@/components/common/skeletons";


function AdminOrdersView() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.shopOrder);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>
        All  Orders 
        </CardTitle>
      </CardHeader>
        <CardContent>
        {!isLoading && error && <p className="py-6 text-center text-destructive">{error}</p>}
        {!isLoading && !error && orders.length === 0 && (
          <p className="py-6 text-center text-muted-foreground">No orders found.</p>
        )}
        <Table>
          <TableHeader>
              <TableRow>
                <TableHead>Order Id</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRowsSkeleton rows={4} columns={5} label="Loading orders" />
            ) : null}
            {!isLoading && orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>${Number(order.totalAmount || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <Dialog
                    open={selectedOrder?._id === order._id}
                    onOpenChange={(open) => setSelectedOrder(open ? order : null)}
                  >
                    <DialogTrigger render={<Button variant="outline" />}>View Details</DialogTrigger>
                    <AdminOrderDetailsView order={order} />
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default AdminOrdersView
