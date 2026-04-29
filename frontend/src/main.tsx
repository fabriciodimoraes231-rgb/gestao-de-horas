import { createRoot } from 'react-dom/client'
import './index.css'
import './wireframe/variables.css'
import './wireframe/layout.css'
import './wireframe/components.css'
import './wireframe/pages.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(<App />)
