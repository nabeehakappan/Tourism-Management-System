import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Destinations from "./pages/Destination";
import Packages from "./pages/Packages";
import Tourists from "./pages/Tourists";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payment";
import Guides from "./pages/Guides";
import Login from "./pages/Login"

function App() {
  return (
    <div className="flex min-h-screen bg-[#f8f7f4]">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tourists" element={<Tourists />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App