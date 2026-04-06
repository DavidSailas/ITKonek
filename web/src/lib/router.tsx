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
        element: <div>IT Professionals</div>,
      },
      {
        path: "customers",
        element: <div>Customers</div>,
      },
      {
        path: "services",
        element: <div>Services</div>,
      },

      // Super Admin

      {
        path: "finance",
        element: <div>Revenue & Payouts</div>,
      },
      {
        path: "analytics",
        element: <div>Platform Analytics</div>,
      },
      {
        path: "support",
        element: <div>Support Tickets</div>,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);