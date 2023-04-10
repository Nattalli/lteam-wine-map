import React from 'react';
import ReactDOM from 'react-dom/client';
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
import NewPassword from './pages/newPassword/NewPassword';
import WinePage from './pages/winePage/Wine';
import UserProfile from './pages/userProfile/UserProfile';
import Catalog from './pages/catalog/Catalog';

import './index.scss';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Registration />} />
      <Route path="reset-password" element={<NewPassword />} />
      <Route path="user-profile" element={<UserProfile />} />
      <Route path="wines/:id" element={<WinePage />} />
      <Route path="wines" element={<Catalog />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById(
  'root'
) as HTMLElement);
root.render(
  <AntdConfigProvider>
    <RouterProvider router={router} />
  </AntdConfigProvider>
);
