// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

// Contextos e rotas protegidas
import ProtectedRoute from './components/ProtectedRoute';       // estudantes/preparatório
import ProtectedRoute1 from './components/ProtectedRoute1';   // administradores
import { AuthProvider } from './context/AuthContext';           // estudantes/preparatório
import { AdminAuthProvider } from './context/AuthContext1';    // administradores

// Páginas públicas
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLogin from './pages/AdminLogin';

// Páginas de estudante/preparatório
import PortalPage from './pages/PortalPage';
import ChangePage from './pages/ChangePage';
import ExamPage from './pages/ExamPage';
import MTcomplementarPage from './pages/MTcomplementarPage';
import ConfigPage from './pages/ConfigPage';
import Banco from './pages/Banco';
import Contato from './pages/Contato';
import Sobre from './pages/Sobre';
import RecuperarSenha from './pages/RecuperarSenha';
import SenhaEsquecida from './pages/SenhaEsquecida';
import Mentoria from './pages/Mentoria';
import ExamQuestions from './pages/ExamQuestions';
import CourseContacts from './pages/CourseContacts';
import ExamClasses from './pages/ExamClasses';


// Páginas de administrador
import AdminDashboard from "./pages/AdminDashboard";

import DestacarCurso from "./pages/DestacarCurso";

import AtualizarVersiculos from "./pages/AtualizarVersiculos";

import ValidarCompra from "./pages/ValidarCompra";
import GerenciarUsuarios from "./pages/GerenciarUsuarios";
import GerenciarCurso from "./pages/GerenciarCurso";

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/CoursesPage" element={<CoursesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/RegisterPage" element={<RegisterPage />} />
            <Route path="/AdminLogin" element={<AdminLogin />} />
            <Route path="/Contato" element={<Contato />} />
            <Route path="/Sobre" element={<Sobre />} />
            <Route path="/RecuperarSenha" element={<RecuperarSenha />} />
            <Route path="/Mentoria" element={<Mentoria />} />

            {/* Dashboard admin (acessível para admin1 e admin2) */}
            <Route
              path="/AdminDashboard"
              element={
                <ProtectedRoute1 allowedUsers={['admin1']}>
                  <AdminDashboard />
                </ProtectedRoute1>
              }
            />

            {/* Rotas protegidas para estudantes */}
            <Route
              path="/PortalPage"
              element={
                <ProtectedRoute allowedRoles={['estudante']}>
                  <PortalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Banco"
              element={
                <ProtectedRoute allowedRoles={['estudante']}>
                  <Banco />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MTcomplementarPage"
              element={
                <ProtectedRoute allowedRoles={['estudante']}>
                  <MTcomplementarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ChangePage"
              element={
                <ProtectedRoute allowedRoles={['estudante']}>
                  <ChangePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ExamPage"
              element={
                <ProtectedRoute allowedRoles={['estudante']}>
                  <ExamPage />
                </ProtectedRoute>
              }
            />

            {/* Rota protegida para preparatorio */}
            <Route
              path="/config"
              element={
                <ProtectedRoute allowedRoles={['preparatorio']}>
                  <ConfigPage />
                </ProtectedRoute>
              }
            />

            {/* Rotas protegidas para admin1 */}
            
            <Route
              path="/DestacarCurso"
              element={
                <ProtectedRoute1 allowedUsers={['admin1']}>
                  <DestacarCurso />
                </ProtectedRoute1>
              }
            />

            <Route
              path="/ExamQuestions"
              element={
                <ProtectedRoute1 allowedUsers={['admin1']}>
                  <ExamQuestions />
                </ProtectedRoute1>
              }
            />

            <Route
              path="/CourseContacts"
              element={
                <ProtectedRoute1 allowedUsers={['admin1']}>
                  <CourseContacts />
                </ProtectedRoute1>
              }
            />

            <Route
              path="/ExamClasses"
              element={
                <ProtectedRoute1 allowedUsers={['admin1']}>
                  <ExamClasses />
                </ProtectedRoute1>
              }
            />

            <Route
              path="/SenhaEsquecida"
              element={
                <ProtectedRoute1 allowedUsers={['admin1']}>
                  <SenhaEsquecida />
                </ProtectedRoute1>
              }
            />
            

            {/* Rotas protegidas para admin2 */}
            <Route
              path="/ValidarCompra"
              element={
                <ProtectedRoute1 allowedUsers={['admin1']}>
                  <ValidarCompra />
                </ProtectedRoute1>
              }
            />
            <Route
              path="/AtualizarVersiculos"
              element={
                <ProtectedRoute1 allowedUsers={['admin1']}>
                  <AtualizarVersiculos />
                </ProtectedRoute1>
              }
            />
            
            <Route
              path="/GerenciarCurso"
              element={
                <ProtectedRoute1 allowedUsers={['admin1']}>
                  <GerenciarCurso />
                </ProtectedRoute1>
              }
            />
            <Route
              path="/GerenciarUsuarios"
              element={
                <ProtectedRoute1 allowedUsers={['admin1']}>
                  <GerenciarUsuarios />
                </ProtectedRoute1>
              }
            />

            {/* Página de acesso negado */}
            <Route path="/unauthorized" element={<h1>Acesso negado</h1>} />
          </Routes>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
