import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/LoginandSignup/Login'
import Signup from './pages/LoginandSignup/Signup'
import Gallery from './pages/showgallery/Gallery'
import ProtectedRoute from './pages/ProtectedRoute/ProtectedRoute'
import Upload from './pages/uploadImage/Upload'
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route  element={<ProtectedRoute />} >
        <Route path='/home' element={<Home />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/upload' element={<Upload />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App