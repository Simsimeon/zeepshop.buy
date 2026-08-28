
import CommonForm from "@/components/common/form"
import { toast } from "@/components/ui/toast"
import { LoginFormControls } from "@/config"
import { loginUser } from "@/store/authslice"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
const initialState = {
name:"",
email:"",
password:""
}
 export const Login = () => {
  const [formData, setFormData ]= useState(initialState)
 const dispatch = useDispatch();
 async function onSubmit (e){
    e.preventDefault()
    try{
     const response = await dispatch(loginUser(formData));
       if(response.payload !== undefined){
        toast.add({
          title:"Login in successfully",
          description:"login",
          duration:4000
        })
       }
    }catch(error){
      
      console.log('error while login', error.message);
      
    }
  }
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
       <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign to your account</h1>
        <p className="mt-2">Don't have an account?<Link className="font-medium ml-2 text-primary hover:underline" to="/auth/register">
          Sign up
         </Link>
        </p>
       </div>
       <CommonForm
       formControls={LoginFormControls}
       buttonText={"Sign Up"}
       formData={formData}
       setFormData={setFormData}
       onSubmit={onSubmit}
       />
      </div>
  )
}
