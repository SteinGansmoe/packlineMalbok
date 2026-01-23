import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
    role: "Admin" | "Ansatt";
    children: ReactNode;
}

export function RequireAdmin({ role, children }: Props) {
    if(role !== "Admin") return <Navigate to="/" replace />;
    return <>{children}</>
}