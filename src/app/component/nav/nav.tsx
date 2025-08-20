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
        
        {user ?    <div className="flex justify-between">
            <Handler/>
                
              <div className="">
                <span className="ml-10">hi! {user?.user_metadata.full_name} </span>
              <link rel="stylesheet" href="component/add"/>
                <a href={`/component/add`} className="hover:text-blue-500 cursor-pointer ml-12">
                        </a>
                        
                </div>
                <Log/>                
            </div> : <Login/>}
            </>
           
    )
}