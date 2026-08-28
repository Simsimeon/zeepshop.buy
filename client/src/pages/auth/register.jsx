
import CommonForm from "@/components/common/form"
import { toast } from "@/components/ui/toast"
import { registerFormControls } from "@/config"
import { registerUser } from "@/store/authslice"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
const initialState = {
username:"",
email:"",
password:""
}
const Register = () => {
  const [formData, setFormData ]= useState(initialState)
 const dispatch = useDispatch();
 const navigate = useNavigate();
 
 console.log(formData);
 
 async function onSubmit (e){
    e.preventDefault()
    try{

     const success=  await dispatch(registerUser(formData))
     console.log(success.payload);
     
     if(success.payload!==undefined){
        toast.add({
          title:"Registered successfully",
          description: "You have signed in successfully.",
          duration: 4000,
        })
       console.log(success)
       
       navigate("/auth/login")
     }
     
    }catch(error){
    //   toast.add({
    //  title: "An error occurred",
    // description: error.message || "Please try again later.", // 💡 Dynamic error text
    // variant: "destructive"
    //   })
      console.log('error due user registration',error.message);
      
    }
    
  }

  
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
       <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new account</h1>
        <p className="mt-2">Already have an account?<Link className="font-medium ml-2 text-primary hover:underline" to="/auth/login">
          Login
          </Link>
        </p>
       </div>
       <CommonForm
       formControls={registerFormControls}
       buttonText={"Sign Up"}
       formData={formData}
       setFormData={setFormData}
       onSubmit={onSubmit}
       />
      </div>
  )
}

export default Register