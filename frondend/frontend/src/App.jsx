import Header from "./components/layouts/Header"
import './App.css'
import Footer from "./components/layouts/Footer"
import Home from "./components/Home"
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import ProductDetail from "./components/product/ProductDetail";

function App() {

  return (
    <Router>
      <div className="App">

        <Header />
        <div className="container container-fluid">
          <ToastContainer />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/product/:id' element={<ProductDetail />} />
          </Routes>

        </div>
        <Footer />

      </div>
    </Router>
  )
}

export default App
