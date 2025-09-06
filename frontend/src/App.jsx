import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CodeEditor from './components/CodeEditor'
import './App.css'

import EditorPage from '../pages/EditorPage';
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';

import { AuthProvider } from './Contexts/AuthContext/AuthProvider';

import User from '../pages/User';
import PrivateRoute from './components/PrivateRoute';

import Layout from './components/Layout';
import { UIProvider } from './Contexts/UIContext/UIProvider';
import { AlertProvider } from './Contexts/AlertContext/AlertProvider';
import { AccessProvider } from './Contexts/AccessContext/AccessProvider';
import Room from '../pages/Room';
import Assignment from '../pages/Assignment';
import CreateLesson from './components/AdminAssignment/CreateLesson';
import Lesson from './components/Lesson';
import EditorPageGuest from '../pages/EditorPageGuest';
import StyleLayout from './components/StyleLayout';
import CollaborateClass from '../pages/CollarborateClass';
import CollaborateClassRoom from '../pages/CollaborateClassRoom';
import CollaborateRoom from '../pages/CollaborateRoom';
import CollaborateTest from './components/CollaborateTest';
import Collaborate from '../pages/Collaborate';
import UpdateLesson from './components/AdminAssignment/UpdateLesson';
import ProfilePage from '../pages/ProfilePage';
import ShareScreen from '../pages/ShareScreen';
import User1 from '../pages/User1';




function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AccessProvider>
          <UIProvider>
            <AlertProvider>
              <Routes>
                <Route element={<StyleLayout />}>
                  <Route element={<Layout />}>
                    <Route path='/room/:roomId/*' element={<Room />} />

                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/assignment/:assignmentId/*' element={<Assignment />} />
                    <Route path='/user/*' element={<PrivateRoute><User1 /></PrivateRoute>} />
                    <Route path='room/:roomId/createlesson' element={<CreateLesson />} />
                    <Route path='/lesson/:lessonId' element={<Lesson />} />
                    <Route path='/updatelesson/:lessonId' element={<UpdateLesson />} />
                    <Route path='/profile' element={<ProfilePage />} />
                  </Route>
                  <Route path='/' element={<HomePage />} />
                  <Route path='/problem/:problemId' element={<EditorPage />} />
                  <Route path='/editor' element={<EditorPageGuest />} />
                  <Route path='/test' element={<CollaborateTest />} />
                  <Route path='/collaborate' element={<Collaborate />} />
                  <Route path='/collaborateclass' element={<CollaborateClass />} />
                  <Route path='/collaborateclassroom/:roomId' element={<CollaborateClassRoom />} />
                  <Route path='/collaborateroom/:roomId' element={<CollaborateRoom />} />
                  <Route path='/sharescreen/:roomId' element={<ShareScreen />} />
                </Route>
              </Routes>

            </AlertProvider>
          </UIProvider>
        </AccessProvider>
      </AuthProvider>
    </BrowserRouter>

  )
}

export default App
