import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { supabase } from "./lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import Login from "./pages/Login"; 
import { AppLayout } from "./layout/AppLayout";
import { MakePickerPage } from "./pages/MakePickerPage";
import { RequireAdmin } from "./routes/RequireAdmin";
import { CreateCarPage } from "./pages/CreateCarPage";
import { CreateFitmentPage } from "./pages/CreateFitmentPage";


function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  type Role = "Admin" | "Ansatt";
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error("Kunne ikke hente session, logg inn på nytt.");
    } 
    setSession(data.session);
    
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => subscription.unsubscribe();
  },[])

  useEffect(() => {
    if(!session) {
      setRole(null);
      return;
    }

    const checkRole = async () => {
      try {
        const { data, error } = await supabase.from("v2_profiles").select("role").eq("id", session.user.id).single();
        if (error) {
          throw new Error("Kan ikke finne rollen til denne brukeren.")
        }
        setRole(data.role as Role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
      
    } 

    checkRole();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  }

  if (loading) return <div>Laster...</div>;

  if(!session) {
    return <Login />;
  }
  if (!role) return <div>Laster rolle…</div>;

return (
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route element={<AppLayout role={role} onLogout={handleLogout} />}>
      <Route path="/" element={<MakePickerPage />} />
      <Route path="/make/:make" element={<div>Make Page</div>} />

      {/* coming next */}
      <Route
  path="/fitments/new"
  element={
    <RequireAdmin role={role}>
      <CreateFitmentPage />
    </RequireAdmin>
  }
/>
<Route
  path="/cars/new"
  element={
    <RequireAdmin role={role}>
       <CreateCarPage />
    </RequireAdmin>
  }
/>
      {/* <Route path="/fitments/:id" element={<FitmentDetailsPage />} /> */}
    </Route>
  </Routes>
);
}

export default App


// <>
//        <p className="font-semibold">Velkommen, {session.user.email}</p>
//        <p>Rolle: {role ?? "Ukjent"}</p>
//        <button onClick={handleLogout}>Logg ut</button>
//      </>
      