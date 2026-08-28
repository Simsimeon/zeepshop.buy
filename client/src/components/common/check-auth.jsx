import { Navigate, useLocation } from "react-router-dom"


function CheckAuth({isAuthenticated, user, children}) {
    const location = useLocation()
    if (!isAuthenticated && !(location.pathname.includes("/login") || location.pathname.includes("/register"))){
        return <Navigate to="/auth/login" replace/>
    }
    if (isAuthenticated && (location.pathname.includes("/login"))) {
        if (user?.role === "admin") {
            return <Navigate to="/admin/dashboard" replace/>
        } else {
              return  <Navigate to="/shop/home" replace />
        }
    }
    if (isAuthenticated && user?.role !== "admin" && location.pathname.includes("admin")) {
        return <Navigate to="/unauth-page" replace />
    }
    if (isAuthenticated && user?.role === "admin" && location.pathname.includes("shop")) {
        return <Navigate to="/admin/dashboard" replace />
    }
return (
    <>{children}</>
)
}


export default CheckAuth;