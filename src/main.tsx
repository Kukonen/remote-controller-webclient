import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./component/Login.tsx";
import {Layout} from "./component/Layout.tsx";
import {Users} from "./component/Users.tsx";
import {Machines} from "./component/Machines.tsx";
import {AppInitializer} from "./component/AppInitializer.tsx";
import {Machine} from "./component/Machine.tsx";
import {Commands} from "./component/Commands.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppInitializer />
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<App />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/machines" element={<Machines />} />
                        <Route path="/machine" element={<Machine />} />
                        <Route path="/commands" element={<Commands />} />
                        <Route path="/login" element={<Login />} />
                    </Route>
                </Routes>
            </Router>
        </ChakraProvider>
    </StrictMode>,
)
