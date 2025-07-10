import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css';
import { SocketProvider } from './context/SocketContext';


ReactDOM.createRoot(document.getElementById('root')).render(

  <StrictMode>

    <BrowserRouter>

      <SocketProvider>

        <App />

      </SocketProvider>

    </BrowserRouter>

  </StrictMode>
);
