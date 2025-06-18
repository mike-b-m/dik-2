'use client'

import { useEffect, useState } from "react";
import { supabase } from "./component/db";
import Add from "./component/add/page";
import Log from "./component/log_out/log";
import Login from "./component/login/page";
import Words from "./component/word/page";


export default function Home() {
    const [user, setUser] = useState<any>()
  
  useEffect(() => {
    const getUser = async () => {
      const { data} = await supabase.auth.getUser();
      const use:any = data?.user
      setUser(use);
    };

    getUser();
  }, []);
  return (
    <>
   
    {user ?   <div className="text-center">
      <Log/>
      <span className="ml-10">{user?.user_metadata.full_name} </span>
      <link rel="stylesheet" href="component/add"/>
        <a href={`/component/add`} className="hover:text-blue-500 cursor-pointer ml-12">
                  ajoute yon mo.
                </a>
        <div className=""> <Words/></div>
    </div> : <Login/>}
      
      {user ? <Add/> : null}
      
      
    </>
  );
}
