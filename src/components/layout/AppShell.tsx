import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

// AppShell keeps global navigation and page spacing consistent across public and private routes.
export const AppShell = () => (
  <div className="min-h-screen overflow-hidden bg-radial-grid">
    <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
    <Navbar />
    <main className="relative z-10 pt-24">
      <Outlet />
    </main>
  </div>
);
