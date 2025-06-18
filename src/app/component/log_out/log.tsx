import { useRouter } from "next/navigation"
import { supabase } from "../db"

export default function Log(){
    const router = useRouter()
       const handleLog_out= async () => {
          await supabase.auth.signOut()
          window.location.href = "/component/login"
          }
    return (
        <button onClick={handleLog_out}
        className="shadow-2xl focus: hover:text-sky-400">dekonekte</button>
    )
}