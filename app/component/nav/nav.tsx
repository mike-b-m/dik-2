'use client'
import Handler from "../ap/api";
import { useEffect, useState } from "react";
import { supabase } from "../db";
import Log from "../log_out/log";
import Login from "../login/page";


export default function Nav(){
    const [user, setUser] = useState<any>()  
      
      useEffect(() => {
        const getUser = async () => {
          const { data} = await supabase.auth.getUser();
          const use:any = data?.user
          setUser(use);
        };
    
        getUser();
      }, []);

    return(
        <>
        {user && (
          <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
            <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
              <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18">
                {/* Left section - Navigation Links */}
                <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 flex-1">
                  <Handler/>
                </div>
                
                {/* Right section - User Info & Logout */}
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-none">
                    Hi! {user?.user_metadata.full_name}
                  </span>
                  <Log/>
                </div>
              </div>
            </div>
          </nav>
        )}
        </>
    )
}