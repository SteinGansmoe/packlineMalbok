import { useEffect, useState } from 'react';
import { supabase } from "./lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import Login from "./pages/Login"; 

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  }

  if (loading) return <div>Laster...</div>;

  return (
    <div>
      {!session ? (
         <Login/>
      ) : (
        <>
        <p>Velkommen, {session.user.email}</p>
        <button onClick={handleLogout}>Logg ut</button>
      </>
      )}
    </div>
  )
}

export default App
