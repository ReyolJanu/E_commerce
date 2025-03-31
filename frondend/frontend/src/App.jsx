import Header from "./components/layouts/Header"
import './App.css'
import Footer from "./components/layouts/Footer"
import Home from "./components/Home"
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

function App() {

  return (
    <Router>
      <div className="App">
        
          <Header />
            <Routes>
              <Route path='/' element={<Home />} />
            </Routes>
          <Footer />
     
      </div>
    </Router>
  )
}

export default App
