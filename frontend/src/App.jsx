import Navbar from './components/navbar';
import {Routes,Route} from 'react-router-dom';
import HomePage from './Home/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore';
import { ToastContainer} from 'react-toastify';
import { VerifyUser } from './utils/VerifyUser';

function App() {
  const {authUser}=useAuthStore();
  return (
    <>
      <div className='p-2 w-screen h-screen flex items-center justify-center'>

        {
        <Routes>

            
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/setting" element={<SettingPage/>} />
            <Route path="/profile/:id" element={<ProfilePage/>} />
            <Route element={<VerifyUser/>}>
            <Route path="/" element={<HomePage/>} />
            </Route>
        </Routes> }
        <ToastContainer/>
    </div>
    </>
  )
}

export default App
