import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Login from './pages/login';
import "./lib/supabaseClient"; // REMOVE LATER WHEN CLIENT IS READY

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Login />
  </StrictMode>
)
