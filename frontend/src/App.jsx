import { Show, SignInButton, SignUpButton, useAuth, UserButton } from '@clerk/react'
import PageLoader from './components/PageLoader'
import Layout from './components/Layout'
import { Routes, Route, Navigate } from "react-router"
import HomePage from './Pages/HomePage'
import CartPage from './Pages/CartPage'
import OrdersPage from './Pages/OrdersPage'
import CheckoutReturnPage from './Pages/CheckoutReturnPage'
import ProductDetailPage from './Pages/ProductDetailPage'
import { SentryDemoPage } from './Pages/SentryDemoPage'
import OrderDetailPage from './Pages/OrderDetailPage'
import OrderSummaryPage from './Pages/OrderSummaryPage'
import OrderChatPage from './Pages/OrderChatPage'

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
        <Route path="/checkout/return" element={<CheckoutReturnPage/>} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/demo-sentry" element={< SentryDemoPage />} />

        <Route path='/orders/:id' element={<OrderDetailPage/>}>
        <Route index element={<OrderSummaryPage />} />
        <Route path='chat' element={<OrderChatPage/>} />
        </Route>
      </Routes>
    </Layout>
  )
}

export default App