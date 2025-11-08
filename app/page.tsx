'use client'

import { useEffect, useState } from "react";
import { supabase } from "./component/db";
import Add from "./component/add/page";

export default function Home() {
    const [user, setUser] = useState<any>()
    const [add, setAdd] = useState(true)  
  useEffect(() => {
    const getUser = async () => {
      const {data} = await supabase.auth.getUser();
      const use:any = data?.user
      setUser(use);
    };

    getUser();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      {user ? (
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6 md:py-8">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Ajoute Nouvo Mo</h1>
          </div>
          {add && <Add />}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[80vh] px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-[90%] sm:max-w-2xl lg:max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6">Diksyone Kreyòl</h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-3 md:mb-4 text-gray-600">Nou ka ajoute mo sou diksyone kreyòl</p>
            <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-4 sm:mb-6 md:mb-8">Konekte pou ajoute mo nan diksyone a</p>
            <a 
              href="/component/login" 
              className="inline-block bg-black hover:bg-gray-800 text-white px-6 sm:px-8 md:px-10 lg:px-12 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg transition-colors duration-200 border border-black"
            >
              Konekte
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
