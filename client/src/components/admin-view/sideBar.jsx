import { ChartNoAxesCombined, LayoutDashboard, Package2, ShoppingBasket } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"
 const AdminSideBarMenuItems =[
    {
        id:"Dashboard",
        label:"Dashboard",
        path: "/admin/dashboard",
        icons:<LayoutDashboard/>
    },
    {
        id:"products",
        label:"Products",
        path: "/admin/product",
        icons:<ShoppingBasket />
    },
    {
        id:"orders",
        label:"Orders",
        path: "/admin/order",
        icons:<Package2 />
    }
]

function MenuItems({setOpen}){
  const navigate= useNavigate()
  return(
    <nav className="mt-8 flex-col flex gap-2">
      {
       AdminSideBarMenuItems.map((menuItem)=><div key={menuItem.id} onClick={()=>{
         setOpen(prev=>!prev)
        navigate(menuItem.path)
        }} className="flex text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground cursor-pointer hover:bg-muted hover:text-foreground">
         {menuItem.icons}
         <span>{menuItem.label}</span>

       </div>) 
      }
    </nav>
  )
}
function AdminSideBar({open,setOpen}) {
  const navigate = useNavigate()
  return (
    <> 
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side='left' className="w-64">
        <div className="flex flex-col h-full">
          <SheetHeader className="border-b">
            <SheetTitle className="flex gap-2 mt-5 mb-5">
              <ChartNoAxesCombined size={30}/>
                     <h1 className="text-2xl font-extrabold ">Admin Panel</h1>
              </SheetTitle>
          </SheetHeader>
          <MenuItems setOpen={setOpen}/>
        </div>

      </SheetContent>
    </Sheet>
     <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
      <div
      onClick={()=>navigate("/admin/dashboard")}
       className="flex cursor-pointer item-center gap-2">
        <ChartNoAxesCombined size={30}/>
        <h1 className="text-2xl font-extrabold ">Admin Panel
        </h1>
      </div>
     <MenuItems />
     </aside>
    </>
  )
}

export default AdminSideBar