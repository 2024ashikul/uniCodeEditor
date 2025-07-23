import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CodeEditor from './components/CodeEditor'
import './App.css'
import NavBar from './components/NavBar'
import EditorPage from '../pages/EditorPage';
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import UserRoom from "../pages/UserRoom";
import { AuthProvider } from './Contexts/AuthContext/AuthProvider';

import User from '../pages/User';
import PrivateRoute from './components/PrivateRoute';
import UserAssignment from '../pages/UserAssignment';
import AdminAssignment from '../pages/AdminAssignment';
import AdminRoom from '../pages/AdminRoom';
import Layout from './components/Layout';
import { UIProvider } from './Contexts/UIContext/UIProvider';
import { AlertProvider } from './Contexts/AlertContext/AlertProvider'; 
import {AccessProvider} from './Contexts/AccessContext/AccessProvider';
import Room from '../pages/Room';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AccessProvider>
          <UIProvider>
            <AlertProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path='/admin/room/:roomId' element={<AdminRoom />} />
                  <Route path='/room/:roomId' element={<Room />} />
                  <Route path='/' element={<HomePage />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/signup' element={<SignUp />} />
                  <Route path='/assignment/:id' element={<UserAssignment />} />
                  <Route path='/admin/assignment/:assignmentId' element={<AdminAssignment />} />
                  <Route path='/user/assignment/:assignmentId' element={<UserAssignment />} />
                  <Route path='/user' element={<PrivateRoute><User /></PrivateRoute>} />
                </Route>
                <Route path='/problem/:problemId' element={<EditorPage />} />
                <Route path='/editor' element={<EditorPage />} />
              </Routes>
            </AlertProvider>
          </UIProvider>
        </AccessProvider>
      </AuthProvider>

    </BrowserRouter>



  )
}

export default App
