import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AntdConfigProvider from './utils/AntdConfigProvider';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Registration from './pages/registration/Registration';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Registration />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AntdConfigProvider>
      <RouterProvider router={router} />
    </AntdConfigProvider>
  </React.StrictMode>
);
