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
import Lessons from './components/AdminRoom/Lessons';
import CreateLesson from './components/CreateLesson';
import Lesson from './components/Lesson';
import EditorPageGuest from '../pages/EditorPageGuest';
import PopUpLayout from './components/PopUpLayout';
import StyleLayout from './components/StyleLayout';
import Collaborate from './components/Collaborate';
import CollaboratePage from '../pages/CollaboratePage';
import CollaborateClass from '../pages/CollarborateClass';



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
                    <Route path='/room/:roomId' element={<Room />} />

                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/assignment/:assignmentId' element={<Assignment />} />
                    <Route path='/user' element={<PrivateRoute><User /></PrivateRoute>} />
                    <Route path='room/:roomId/createlesson' element={<CreateLesson />} />
                    <Route path='/lesson/:lessonId' element={<Lesson />} />

                  </Route>
                  <Route path='/' element={<HomePage />} />
                  <Route path='/problem/:problemId' element={<EditorPage />} />
                  <Route path='/editor' element={<EditorPageGuest />} />
                  <Route path='/test' element={<Collaborate />} />
                  <Route path='/collaborate' element={<CollaboratePage />} />
                  <Route path='/collaborateclass' element={<CollaborateClass />} />
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
