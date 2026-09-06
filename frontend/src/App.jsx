import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] flex">

      <Sidebar />

      <div className="flex-1 min-w-0">

        <Topbar />

        <main>
          <Dashboard />
        </main>

      </div>

    </div>
  );
}

export default App;