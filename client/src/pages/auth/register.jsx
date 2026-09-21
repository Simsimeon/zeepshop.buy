import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { registerUser } from "@/store/authslice";

const initialState = {
  username: "",
  email: "",
  password: "",
};

const Register = () => {
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFormValid =
    formData.username.trim() && formData.email.trim() && formData.password.trim();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await dispatch(registerUser(formData));

      if (registerUser.rejected.match(response)) {
        toast.add({
          type: "error",
          title: "Registration failed",
          description:
            response.payload || "Something went wrong. Please try again.",
          duration: 4000,
        });
        return;
      }

      if (response.payload !== undefined) {
        toast.add({
          title: "Account created",
          description: "You can now sign in with your new account.",
          duration: 4000,
        });
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("error due user registration", error.message);

      toast.add({
        type: "error",
        title: "Registration failed",
        description: error?.message || "Please try again later.",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join Zeepshop to start shopping in seconds.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Choose a username"
            className="h-10"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-10"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              className="h-10 pr-10"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="h-10 w-full"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;