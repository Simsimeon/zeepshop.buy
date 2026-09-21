import { Link, Outlet } from "react-router-dom";
import { HousePlug, ShieldCheck, Sparkles, Truck } from "lucide-react";

const highlights = [
  {
    icon: Truck,
    title: "Fast, tracked delivery",
    description: "Follow every order from checkout to your doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    description: "Pay confidently with encrypted Paystack payments.",
  },
  {
    icon: Sparkles,
    title: "Curated catalog",
    description: "Handpicked products across every category.",
  },
];

function BrandMark({ className = "" }) {
  return (
    <Link
      to="/shop/home"
      className={`flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <HousePlug className="size-6" />
      <span className="text-lg font-bold tracking-tight">Zeepshop</span>
    </Link>
  );
}

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-1/2 flex-col justify-between bg-neutral-800 px-12 py-14 lg:flex">
        <div className="text-neutral-100">
          <BrandMark />
        </div>

        <div className="max-w-md space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-neutral-50">
              Shop smarter, every single day.
            </h1>
            <p className="text-sm leading-6 text-neutral-400">
              Sign in to track orders, save delivery addresses, and check out faster.
            </p>
          </div>

          <ul className="space-y-4 pt-2">
            {highlights.map(({ title, description }) => (
              <li key={title}>
                <p className="text-sm font-semibold text-neutral-100">
                  {title}
                </p>
                <p className="text-sm leading-6 text-neutral-400">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-neutral-500">
          © {new Date().getFullYear()} Zeepshop. All rights reserved.
        </p>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="mb-8 lg:hidden">
          <BrandMark />
        </div>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;