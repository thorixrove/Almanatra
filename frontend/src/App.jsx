import { Show, SignInButton, SignUpButton, useAuth, UserButton } from '@clerk/react'
import PageLoader from './components/PageLoader'
import Layout from './components/Layout'
import { Routes, Route, Navigate } from "react-router"
import HomePage from './Pages/HomePage'
import CartPage from './Pages/CartPage'
import OrdersPage from './Pages/OrdersPage'

function App() {
  const {isLoaded, isSignedIn}=useAuth()

  if(!isLoaded) return <PageLoader/>
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/orders" element={isSignedIn ? <OrdersPage/> : <Navigate to={"/"} replace/>} 
        />
      </Routes>
    </Layout>
  )
}

export default App