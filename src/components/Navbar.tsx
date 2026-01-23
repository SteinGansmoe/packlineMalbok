// src/components/Navbar.tsx
import { Link, NavLink } from "react-router-dom";

type Props = {
  role: "Admin" | "Ansatt";
  onLogout: () => void;
};

export function Navbar({ role, onLogout }: Props) {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link to="/" className="font-semibold">
          Packline Malbok
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <NavLink to="/" className="hover:underline">
            Hjem
          </NavLink>

          {role === "Admin" && (
            <>
            <NavLink to="/fitments/new" className="hover:underline">
              Ny fitment
            </NavLink>
            <NavLink to="/cars/new" className="hover:underline">
            Ny bil
            </NavLink>
            </>
          )}

          <span className="rounded-md border px-2 py-1 text-xs">{role}</span>

          <button
            onClick={onLogout}
            className="rounded-md border px-3 py-1 hover:bg-gray-50"
          >
            Logg ut
          </button>
        </nav>
      </div>
    </header>
  );
}
