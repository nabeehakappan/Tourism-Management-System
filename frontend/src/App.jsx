import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Packages from "./pages/Packages";
import Tourists from "./pages/Tourists";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payment";
import Guides from "./pages/Guides";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      {/* Login page opens first */}
      <Route path="/" element={<Login />} />

      {/* Main application */}
      <Route
        path="/dashboard"
        element={
          <div className="flex min-h-screen bg-[#f8f7f4]">
            <Sidebar />

            <div className="flex-1">
              <Topbar />

              <main className="p-8">
                <Dashboard />
              </main>
            </div>
          </div>
        }
      />

      <Route
        path="/tourists"
        element={
          <div className="flex min-h-screen bg-[#f8f7f4]">
            <Sidebar />
            <div className="flex-1">
              <Topbar />
              <main className="p-8">
                <Tourists />
              </main>
            </div>
          </div>
        }
      />

      <Route
        path="/packages"
        element={
          <div className="flex min-h-screen bg-[#f8f7f4]">
            <Sidebar />
            <div className="flex-1">
              <Topbar />
              <main className="p-8">
                <Packages />
              </main>
            </div>
          </div>
        }
      />

      <Route
        path="/bookings"
        element={
          <div className="flex min-h-screen bg-[#f8f7f4]">
            <Sidebar />
            <div className="flex-1">
              <Topbar />
              <main className="p-8">
                <Bookings />
              </main>
            </div>
          </div>
        }
      />

      <Route
        path="/payments"
        element={
          <div className="flex min-h-screen bg-[#f8f7f4]">
            <Sidebar />
            <div className="flex-1">
              <Topbar />
              <main className="p-8">
                <Payments />
              </main>
            </div>
          </div>
        }
      />

      <Route
        path="/guides"
        element={
          <div className="flex min-h-screen bg-[#f8f7f4]">
            <Sidebar />
            <div className="flex-1">
              <Topbar />
              <main className="p-8">
                <Guides />
              </main>
            </div>
          </div>
        }
      />

      {/* Keep /login working too */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
