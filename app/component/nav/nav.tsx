'use client'
import Handler from "../ap/api";
import { useEffect, useState } from "react";
import { supabase } from "../db";
import Log from "../log_out/log";

type User = {
  user_metadata: {
    full_name: string
  }
}

export default function Nav() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user as User | null);
    };
    getUser();
  }, []);

  return (
    <>
      {user && (
        <nav className="border-b border-mist bg-paper/90 backdrop-blur sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-3 sm:px-6">
            <div className="flex flex-wrap justify-between items-center min-h-14 sm:min-h-16 py-2 gap-x-3 gap-y-1.5">
              <a href="/" className="flex items-center gap-2 shrink-0 whitespace-nowrap" title="Akèy">
                <span className="flex flex-col gap-[3px]" aria-hidden="true">
                  <span className="w-5 h-[7px] rounded-sm bg-blueht" />
                  <span className="w-5 h-[7px] rounded-sm bg-redht" />
                </span>
                <span className="font-display font-bold text-base sm:text-lg tracking-tight hidden md:inline">
                  Diksyonè Kreyòl
                </span>
              </a>

              <div className="flex items-center gap-2 sm:gap-3 order-2 md:order-3 shrink-0">
                <span className="hidden sm:inline text-sm text-ink-soft truncate max-w-[180px]">
                  {user?.user_metadata.full_name}
                </span>
                <Log />
              </div>

              <div className="order-3 md:order-2 mx-auto md:mx-0">
                <Handler />
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  )
}
