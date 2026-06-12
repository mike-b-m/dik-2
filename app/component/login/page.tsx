"use client"
import { supabase } from "../db"

export default function Login() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-mist rounded-2xl shadow-sm p-8 sm:p-10 text-center">
          <span className="inline-flex flex-col gap-1 mb-5" aria-hidden="true">
            <span className="w-10 h-2.5 rounded-sm bg-blueht" />
            <span className="w-10 h-2.5 rounded-sm bg-redht" />
          </span>
          <h1 className="font-display text-3xl font-bold mb-2">Diksyonè Kreyòl</h1>
          <h2 className="text-lg text-ink mb-1">Konekte</h2>
          <p className="text-sm text-ink-soft mb-8">
            Konekte pou w ka kontribye nan diksyonè a
          </p>

          <button
            onClick={handleLogin}
            className="w-full bg-white border border-mist hover:border-blueht hover:shadow-md transition-all rounded-full px-6 py-3 flex items-center justify-center gap-3 text-sm sm:text-base font-medium"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Konekte ak Google</span>
          </button>

          <div className="tricolor-rule mt-8 max-w-[100px] mx-auto" />
        </div>
      </div>
    </div>
  )
}
