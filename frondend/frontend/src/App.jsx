import Header from "./components/layouts/Header"
import './App.css'
import Footer from "./components/layouts/Footer"
import Home from "./components/Home"
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import ProductDetail from "./components/product/ProductDetail";
import ProductSearch from "./components/product/ProductSearch";
import Login from "./components/user/login";
import Register from "./components/user/Register";
import { useEffect } from "react";
import store from './store'
import { loadUser } from "./actions/userActions";
import Profile from "./components/user/Profile";
import ProtectedRoute from "./components/route/ProtectedRoute";
import UpdateProfile from "./components/user/UpdateProfile";

function App() {

  useEffect(()=>{
    store.dispatch(loadUser)
  })

  return (
    <Router>
      <div className="App">

        <Header />
        <div className="container container-fluid">
          <ToastContainer />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/product/:id' element={<ProductDetail />} />
            <Route path='/search/:keyword' element={<ProductSearch />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/myprofile' element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
            <Route path='/myprofile/update' element={<ProtectedRoute> <UpdateProfile /> </ProtectedRoute>} />
          </Routes>

        </div>
        <Footer />

      </div>
    </Router>
  )
}

export default App
