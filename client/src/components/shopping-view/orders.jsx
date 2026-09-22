import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { fetchUserOrders } from "@/store/shop/order-slice";
import ShoppingOrderDetailsViews from "./order-details";
import { Badge } from "../ui/badge";
import { TableRowsSkeleton } from "@/components/common/skeletons";

function ShoppingOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading, error } = useSelector((state) => state.shopOrder);

  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchUserOrders(user.userId));
    }
  }, [dispatch, user?.userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
           Order History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isLoading && error && <p className="py-6 text-center text-destructive">{error}</p>}
        {!isLoading && !error && orders.length === 0 && (
          <p className="py-6 text-center text-muted-foreground">No orders yet.</p>
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
                <TableCell >
                  <Badge className={`py-1 px-3 ${order.orderStatus ==="confirmed" ? "bg-green-500": ""}` }>
                     {order.orderStatus}
                  </Badge>
                  </TableCell>
                <TableCell>${Number(order.totalAmount || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <Dialog
                    open={selectedOrder?._id === order._id}
                    onOpenChange={(open) => setSelectedOrder(open ? order : null)}
                  >
                    <DialogTrigger render={<Button variant="outline" />}>View Details</DialogTrigger>
                    <ShoppingOrderDetailsViews order={order} />
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

export default ShoppingOrders

