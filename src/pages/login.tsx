import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);


const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email) {
        setError("Skriv din email her.");
        return;
    }
    console.log("Form passed successfully")
    setLoading(true);
    supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin},
    })
}


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
                <button 
                type="submit"
                disabled={loading}>
                {loading ? "Sender..." : "Logg inn"}
                </button>
            </form>
        </div>
    )
} 