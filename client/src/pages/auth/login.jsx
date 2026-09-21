import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { loginUser } from "@/store/authslice";

const initialState = {
  email: "",
  password: "",
};

export const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const isFormValid = formData.email.trim() && formData.password.trim();

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
      const resultAction = await dispatch(loginUser(formData));

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
      }
    } catch (error) {
      console.error("error while login", error);

      toast.add({
        type: "error",
        title: "Login failed",
        description: error?.message || "Something went wrong. Please try again.",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue shopping.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
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
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/auth/forgot-password"
              className="rounded-md text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
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
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          to="/auth/register"
          className="font-medium text-primary hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
};
