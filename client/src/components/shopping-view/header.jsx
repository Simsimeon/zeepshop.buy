import {
  HousePlug,
  LogIn,
  LogOut,
  Menu,
  ShoppingCart,
  UserCheck,
  UserPlus,
} from "lucide-react";
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
import { Badge } from "../ui/badge";

const categoryMenuIds = ["men", "women", "kids", "accessories", "footwear"];

function MenuItems({ onNavigate }) {
  const navigate = useNavigate();

  function handleNavigate(menuItem) {
    if (categoryMenuIds.includes(menuItem.id)) {
      sessionStorage.setItem(
        "filter",
        JSON.stringify({ category: [menuItem.id] }),
      );
      navigate(`${menuItem.path}?category=${menuItem.id}`);
    } else {
      sessionStorage.removeItem("filter");
      navigate(menuItem.path);
    }

    onNavigate?.();
  }

  return (
    <nav className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-1">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <button
          key={menuItem.id}
          type="button"
          onClick={() => handleNavigate(menuItem)}
          className="rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:py-1.5"
        >
          {menuItem.label}
        </button>
      ))}
    </nav>
  );
}

function UnauthenticatedActions({ variant = "desktop", onNavigate }) {
  const navigate = useNavigate();

  function goTo(path) {
    navigate(path);
    onNavigate?.();
  }

  if (variant === "mobile") {
    return (
      <div className="mt-6 border-t pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Account
        </p>
        <div className="flex flex-col gap-2">
          <Button
            className="w-full justify-center gap-2"
            onClick={() => goTo("/auth/login")}
          >
            <LogIn className="size-4" />
            Sign in
          </Button>
          <Button
            variant="outline"
            className="w-full justify-center gap-2"
            onClick={() => goTo("/auth/register")}
          >
            <UserPlus className="size-4" />
            Create account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={() => goTo("/auth/login")}>
        Sign in
      </Button>
      <Button className="gap-2" onClick={() => goTo("/auth/register")}>
        <UserPlus className="size-4" />
        Sign up
      </Button>
    </div>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const [openCartSheet,setOpenCartSheet]=useState(false)
    const {cartItem}=useSelector(state=>state.shopCart);
  const cartItemCount = cartItem?.items?.reduce(
    (total, item) => total + Number(item?.quantity || 0),
    0,
  ) || 0;
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
        <Button
          onClick={()=>setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
        <ShoppingCart className="w-6 h-6" />
        {cartItemCount > 0 && (
          <Badge className="absolute -right-2 -top-2 min-w-5 px-1">
            {cartItemCount > 99 ? "99+" : cartItemCount}
          </Badge>
        )}
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
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link
          to="/shop/home"
          className="flex shrink-0 items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">E-Commerce</span>
        </Link>
        <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
          <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-muted lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs p-4">
            <MenuItems onNavigate={() => setOpenMobileMenu(false)} />
            {isAuthenticated ? (
              <div className="mt-4">
                <HeaderRightContent />
              </div>
            ) : (
              <UnauthenticatedActions
                variant="mobile"
                onNavigate={() => setOpenMobileMenu(false)}
              />
            )}
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          {isAuthenticated ? <HeaderRightContent /> : <UnauthenticatedActions />}
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
