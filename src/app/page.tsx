'use client'

import { useEffect, useState } from "react";
import { supabase } from "./component/db";
import Add from "./component/add/page";

export default function Home() {
    const [user, setUser] = useState<any>()
    const [add, setAdd] = useState(true)  
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
   
    {user ?    <div className="text-center">
      <link rel="stylesheet" href="component/add"/>
        <a href={`/component/add`} className="hover:text-blue-500 cursor-pointer ml-12">
                </a>
                <button>Ajoute mo a</button>
                {add ? <div className=""> <Add/> </div> : <div>null</div> }
        
    </div> : null}     
    </>
  );
}
