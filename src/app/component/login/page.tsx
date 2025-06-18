"use client"
import { supabase } from "../db"
 export default function Login(){
   const handlelogin= async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
        })
    }
    return(
        <>
        <div className="">
        <h2>Konekte</h2>
        <button
        onClick={handlelogin}
      className="bg-white border border-gray-300 rounded px-4 py-2 flex items-center gap-2 hover:shadow-md"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="w-5 h-5"
      />
      <span>konekte ak google</span>
    </button>
       </div>
        </>
    )
}