import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import HomeDashboard from "./pages/HomeDashboard";
import LecturerLogin from "./pages/LecturerLogin";
import LecturerRegister from "./pages/LecturerRegister";
import LecturerDashboard from "./pages/LecturerDashboard";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/lecturer/login" element={<LecturerLogin />} />
        <Route path="/auth/lecturer/register" element={<LecturerRegister />} />

        <Route path="/student/dashboard" element={<HomeDashboard />} />
        <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
      </Routes>
    </>
  );
}

export default App;
