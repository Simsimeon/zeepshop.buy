
import CommonForm from "@/components/common/form"
import { toast } from "@/components/ui/toast"
import { LoginFormControls } from "@/config"
import { loginUser } from "@/store/authslice"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

const initialState = {
  name: "",
  email: "",
  password: "",
};

export const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const resultAction = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(resultAction)) {
        toast.add({
          title: "Login successful",
          description: "Welcome back!",
          duration: 4000,
        });
        return;
      }

      if (loginUser.rejected.match(resultAction)) {
        const errorMessage =
          resultAction.payload ||
          resultAction.error?.message ||
          "Invalid email or password";

        toast.add({
          type: "error",
          title: "Login failed",
          description: errorMessage,
          duration: 4000,
        });
        return;
      }

      toast.add({
        type: "error",
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        duration: 4000,
      });
    } catch (error) {
      console.error("error while login", error);

      toast.add({
        type: "error",
        title: "Login failed",
        description: error?.message || "Something went wrong. Please try again.",
        duration: 4000,
      });
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in to your account</h1>
        <p className="mt-2">
          Don't have an account?
          <Link className="font-medium ml-2 text-primary hover:underline" to="/auth/register">
            Sign up
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={LoginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};
