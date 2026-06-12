import { supabase } from "../db"

export default function Log() {
  const handleLogOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/component/login"
  }
  return (
    <button
      onClick={handleLogOut}
      className="px-3 sm:px-4 py-1.5 rounded-full border border-mist text-xs sm:text-sm text-ink-soft hover:border-redht hover:text-redht transition-colors whitespace-nowrap"
    >
      Dekonekte
    </button>
  )
}
