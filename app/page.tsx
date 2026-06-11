'use client'

import { useEffect, useState } from "react";
import { supabase } from "./component/db";
import Add from "./component/add/page";

type User = {
  id: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user as User | null);
      setChecking(false)
    };
    getUser();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink-soft italic">Chajman…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {user ? (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="text-center mb-8">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-redht font-semibold mb-2">
              Espas kontribitè
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold">
              Ajoute yon nouvo mo
            </h1>
            <p className="text-ink-soft mt-2 max-w-lg mx-auto text-sm sm:text-base">
              Plis detay ou bay, pi rich diksyonè a ap ye. Sèl mo a ak
              definisyon an obligatwa — rès la se bonis!
            </p>
          </div>
          <Add />
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[85vh] px-4">
          <div className="text-center max-w-xl">
            <span className="inline-flex flex-col gap-1 mb-6" aria-hidden="true">
              <span className="w-12 h-3 rounded-sm bg-blueht" />
              <span className="w-12 h-3 rounded-sm bg-redht" />
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Diksyonè Kreyòl
            </h1>
            <p className="text-lg sm:text-xl text-ink-soft mb-2">
              Ede nou bati pi gwo diksyonè kreyòl ayisyen an sou entènèt.
            </p>
            <p className="text-sm sm:text-base text-ink-soft mb-8">
              Konekte pou w ka ajoute mo, definisyon, egzanp ak plis ankò.
            </p>
            <a
              href="/component/login"
              className="inline-block bg-blueht hover:bg-blueht-deep text-white px-10 py-3 rounded-full text-base font-medium transition-colors"
            >
              Konekte
            </a>
            <p className="mt-6 text-sm">
              <a href="https://diksyonekreyol.org" className="text-ink-soft hover:text-blueht transition-colors">
                ← Tounen sou diksyonè a
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
