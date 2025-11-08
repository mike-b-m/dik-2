"use client"
import { supabase } from "../db"
 export default function Login(){
   const handlelogin= async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
        })
    }
    return(
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-[90%] sm:max-w-md md:max-w-lg">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Diksyone Kreyòl</h1>
            <h2 className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3">Konekte</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">Konekte pou aksede diksyone a</p>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handlelogin}
              className="bg-white border-2 border-black hover:bg-black hover:text-white transition-colors duration-200 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg w-full sm:w-auto justify-center"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <span>Konekte ak Google</span>
            </button>
          </div>
        </div>
      </div>
    )
}