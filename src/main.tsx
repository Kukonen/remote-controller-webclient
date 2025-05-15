import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./component/Login.tsx";
import {Layout} from "./component/Layout.tsx";
import {Users} from "./component/Users.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<App />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/login" element={<Login />} />
                    </Route>
                </Routes>
            </Router>
        </ChakraProvider>
    </StrictMode>,
)
