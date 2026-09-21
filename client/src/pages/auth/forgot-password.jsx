import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function onSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    // NOTE: password reset email delivery is not implemented on the server yet.
    // When a reset endpoint exists, dispatch it here instead of just switching state.
    setIsSubmitted(true);
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      {isSubmitted ? (
        <div className="space-y-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-foreground">
            <MailCheck className="size-6" />
          </span>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Request received
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              We saved your request for{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Password reset emails aren&apos;t enabled yet, so please contact
              support to reset your password.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-10 w-full"
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
          >
            Try another email
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Reset your password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the email linked to your account and we&apos;ll help you get
              back in.
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="h-10 w-full"
              disabled={!email.trim()}
            >
              Continue
            </Button>
          </form>
        </>
      )}

      <Link
        to="/auth/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>
    </div>
  );
}

export default ForgotPassword;
