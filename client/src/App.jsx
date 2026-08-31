import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import { Login } from "./pages/auth/login";
import Register from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashBoard from "./pages/admin-view/dashoard";
import AdminProduct from "./pages/admin-view/product";
import AdminOrder from "./pages/admin-view/order";
import AdminFeatures from "./pages/admin-view/feature";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/notFound";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingListing from "./pages/shopping-view/listing";
import SHoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingHome from "./pages/shopping-view/home";
import CheckAuth from "./components/common/check-auth";
import Unauthpage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/authslice";
import { Skeleton } from "./components/ui/skeleton";
export default function App() {
  
  const { isAuthenticated,user,isLoading}=useSelector(state=>state.auth)
  console.log(isAuthenticated,user);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(checkAuth())
  },[dispatch])
  if(isLoading)return(<Skeleton className="w-150 h-150 rounded-full">Loading.....</Skeleton>)
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* <h1>Header component</h1> */}
      <Routes>
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <AuthLayout/>
        </CheckAuth> }>
          <Route path="login"  element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
        </Route>
        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
               <AdminLayout/>
          </CheckAuth>}>
           <Route path="dashboard"  element={<AdminDashBoard/>}/>
           <Route path="products"  element={<AdminProduct/>}/>
           <Route path="order"  element={<AdminOrder/>}/>
           <Route path="feature"  element={<AdminFeatures/>}/>
        </Route>
        <Route path="/shop" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><ShoppingLayout/></CheckAuth>}>
            <Route path="home" element={<ShoppingHome/>}/>
            <Route path="checkout" element={<SHoppingCheckout/>}/>
            <Route path="listing" element={<ShoppingListing/>}/>
            <Route path="account" element={<ShoppingAccount/>}/>
        </Route>
         <Route path="unauth-page" element={<Unauthpage/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </div>
  )
}
