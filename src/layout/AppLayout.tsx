// src/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

type Props = {
  role: "Admin" | "Ansatt";
  onLogout: () => void;
};

export function AppLayout({ role, onLogout }: Props) {
  return (
    <div className="min-h-screen">
      <Navbar role={role} onLogout={onLogout} />
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
