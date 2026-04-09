import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import BookingsPage from '@/pages/dashboard/BookingsPage';
import ProfessionalsPage from '@/pages/dashboard/ProfessionalsPage';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    
    // GUARD 1: Protect All Path
    element: <ProtectedRoute allowedRoles={['admin', 'superadmin']} />,
    children: [
      {

        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "bookings",
            element: <BookingsPage />,
          },
          {
            path: "pros",
            element: <ProfessionalsPage />,
          },
          {
            path: "customers",
            element: <div>Customers</div>,
          },
          {
            path: "services",
            element: <div>Services</div>,
          },

          // GUARD 2: Nested Super Admin Routes
          {
            element: <ProtectedRoute allowedRoles={['superadmin']} />,
            children: [
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
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);