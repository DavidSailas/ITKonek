import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardPage from '@/pages/dashboard/DashboardPage';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true, 
        element: <DashboardPage />,
      },
      {
        path: "bookings",
        element: <div>Bookings Screen</div>,
      },
      {
        path: "pros",
        element: <div>IT Professionals Management</div>,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);