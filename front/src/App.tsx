import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Login } from './compenents/log&signin/Login'
import SignUp from './compenents/log&signin/SignUp'
import ForgotPassword from './compenents/log&signin/ForgotPassword'





function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup'element={<SignUp/>}/>
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
      </Routes>
    </Router>
        
  )
}

export default App

