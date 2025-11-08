import { useRouter } from "next/navigation"
import { supabase } from "../db"

export default function Log(){
    const router = useRouter()
       const handleLog_out= async () => {
          await supabase.auth.signOut()
          window.location.href = "/component/login"
          }
    return (
        <div>
         <button 
            onClick={handleLog_out}
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-black hover:bg-black hover:text-white transition-colors duration-200 text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap"
         >
            Dekonekte
         </button>   
        </div>
    )
}