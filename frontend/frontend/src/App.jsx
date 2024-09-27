import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";

const appRouter = createBrowserRouter([
  //client
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/jobs",
    element: <Jobs></Jobs>,
  },
  {
    path: "/description/:id",
    element: <JobDescription></JobDescription>,
  },
  {
    path: "/browse",
    element: <Browse></Browse>,
  },
  {
    path: "/profile",
    element: <Profile></Profile>,
  },
  //admin
  {
    path: "/admin/companies",
    element: <Companies></Companies>,
  },
  {
    path: "/admin/companies/create",
    element: <CompanyCreate></CompanyCreate>,
  },
  {
    path: "/admin/companies/:id",
    element: <CompanySetup></CompanySetup>,
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <AdminJobs></AdminJobs>
      </ProtectedRoute>
    ),
  },
  {
    path: "admin/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob></PostJob>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants></Applicants>
      </ProtectedRoute>
    ),
  },
]);
function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
