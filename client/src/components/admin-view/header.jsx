import { LogOut, Menu } from "lucide-react"
import { Button } from "../ui/button"

const AdminHeader = ({setOpen}) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
       <Button onClick={()=>setOpen(prev=>!prev)} className="lg:hidden sm:block">
        <Menu />
        <span className="sr-only">Toggle menu</span>
        </Button>    
  
       <div className="flex flex-1 justify-end">
        <Button className="inline-flex gap-2 cursor-pointer items-center rounded-md px-4 py-2 txt-sm font-medium shadow">
          <LogOut />
          Logout
          </Button>
       </div>
       </header> 
  )
}

export default AdminHeader