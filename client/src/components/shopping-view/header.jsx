import { HousePlug, LogOut, Menu, ShoppingCart, UserCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/authslice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItem } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate()
  function handleNavigate(getCurrentMenuItem){
    if (getCurrentMenuItem.id === "home") {
      sessionStorage.removeItem("filter");
      navigate(getCurrentMenuItem.path);
    } else {
      const nextFilter = {
        category: [getCurrentMenuItem.id],
      };
      sessionStorage.setItem("filter", JSON.stringify(nextFilter));
      navigate(`${getCurrentMenuItem.path}?category=${getCurrentMenuItem.id}`);
    }
  }
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
           onClick={()=>handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
           key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const [openCartSheet,setOpenCartSheet]=useState(false)
    const {cartItem}=useSelector(state=>state.shopCart);
  console.log(user);
  const firstInitial = user?.username.slice(0, 1).toUpperCase();
  const lastInitial = user?.username.slice(-1).toUpperCase();
  const completeInitial = `${firstInitial}${lastInitial}`;
 const navigate = useNavigate()
 const dispatch=useDispatch()
 function handleLogout (){
     dispatch(logoutUser())
 }
 useEffect(()=>{
  dispatch(fetchCartItem(user?.userId))
 },[dispatch,user?.userId])
 console.log(cartItem.items,'jjjjj');
 
  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
        <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button onClick={()=>setOpenCartSheet(true)} variant="outline" size="icon">
        <ShoppingCart className="w-6 h-6" />
        <span className="sr-only">User Cart</span>
      </Button>
      <UserCartWrapper
      setOpenCartSheet={setOpenCartSheet}
       cartItem={cartItem}/>
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {completeInitial}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              logged in as {completeInitial}
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={()=>navigate("/shop/account")}>
              <UserCheck className="mr-2 h-4 w-4"/>
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={()=>handleLogout()}>
              <LogOut className="mr-2 h-4 w-4"  />
              logout
            </DropdownMenuItem>
        </DropdownMenuGroup>   
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">E-Commerce</span>
        </Link>
        <Sheet>
          <SheetTrigger className="inline-flex  h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-foreground lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-2 w-full max-w-xs">
            <MenuItems />
             {isAuthenticated ? (
          <div className="">
            <HeaderRightContent />
          </div>
        ) : null}
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block ">
          <MenuItems />
        </div>
        <span className="hidden lg:block">
        {isAuthenticated ? (
          <div className="">
            <HeaderRightContent />
          </div>
        ) : null}
        </span>
      </div>
    </header>
  );
}

export default ShoppingHeader;
