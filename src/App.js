// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

// Contextos e rotas protegidas
import ProtectedRoute from './components/ProtectedRoute';       // estudantes/preparatório
import ProtectedRoute_1 from './components/ProtectedRoute_1';   // administradores
import { AuthProvider } from './context/AuthContext';           // estudantes/preparatório
import { AdminAuthProvider } from './context/AuthContext_1';    // administradores

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
import Senha_esquecida from './pages/Senha_esquecida';
import Mentoria from './pages/Mentoria';


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
                <ProtectedRoute_1 allowedUsers={['admin1']}>
                  <AdminDashboard />
                </ProtectedRoute_1>
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
                <ProtectedRoute_1 allowedUsers={['admin1']}>
                  <DestacarCurso />
                </ProtectedRoute_1>
              }
            />

            <Route
              path="/Senha_esquecida"
              element={
                <ProtectedRoute_1 allowedUsers={['admin1']}>
                  <Senha_esquecida />
                </ProtectedRoute_1>
              }
            />
            

            {/* Rotas protegidas para admin2 */}
            <Route
              path="/ValidarCompra"
              element={
                <ProtectedRoute_1 allowedUsers={['admin1']}>
                  <ValidarCompra />
                </ProtectedRoute_1>
              }
            />
            <Route
              path="/AtualizarVersiculos"
              element={
                <ProtectedRoute_1 allowedUsers={['admin1']}>
                  <AtualizarVersiculos />
                </ProtectedRoute_1>
              }
            />
            
            <Route
              path="/GerenciarCurso"
              element={
                <ProtectedRoute_1 allowedUsers={['admin1']}>
                  <GerenciarCurso />
                </ProtectedRoute_1>
              }
            />
            <Route
              path="/GerenciarUsuarios"
              element={
                <ProtectedRoute_1 allowedUsers={['admin1']}>
                  <GerenciarUsuarios />
                </ProtectedRoute_1>
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
