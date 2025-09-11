import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import SignUp from './compenents/log&signin/SignUp'
import ForgotPassword from './compenents/log&signin/ForgotPassword'
import Login from './compenents/log&signin/Login'
import Home from "./home";





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup'element={<SignUp/>}/>
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
      </Routes>
    </Router>
        
  )
}

export default App

