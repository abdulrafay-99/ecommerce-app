import { Routes,Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Navbar from "./components/Navbar"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import AdminPage from "./pages/AdminPage"
import CategoryPage from "./pages/CategoryPage"
import CartPage from "./pages/CartPage"
import PurchaseCancelPage from "./pages/purchaseCancelPage"
import PurchaseSuccessPage from "./pages/purchaseSuccessPage"
import LoadingSpinner from "./components/LoadingSpinner"
import {Toaster} from "react-hot-toast"
import { useUserStore } from "./stores/useUserStore"
import { useEffect,useState } from "react"
import axiosInstance from "./lib/axios"




function App() {
  const {user,setUser}=useUserStore() 
  const [loading,setLoading]=useState(true)
  useEffect(() => {
    // Define an async function inside the effect
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/auth/profile");
        setUser(response.data);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        // Handle error, e.g., clear user, redirect to login
        setUser(null); // Example: Clear user on error
        setLoading(false)
      }
    };
    
    fetchProfile();
    
  },[] ); // <

  	if (loading) return <LoadingSpinner />;

  return (
        <div className='min-h-screen text-white bg-gray-900 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)] pt-20'>
        <Navbar/>
			  <Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/signup' element={!user ? <SignupPage /> : <Navigate to='/' />} />
					<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
					<Route
						path='/secret-dashboard'
						element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
					/>
					<Route path='/category/:category' element={<CategoryPage />} />
					<Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
					<Route
						path='/purchase-success'
						element={user? <PurchaseSuccessPage />:<Navigate to='/login'/> }
					/>
					<Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
				</Routes>
      <Toaster/>
      </div> 
  )
}

export default App
