'use server'
import { useEffect, useState } from 'react';
import {supabase} from '../db'

export default async function Handler(req:any, res:any) {
    const [user, setUser] = useState<any>()
      
      useEffect(() => {
        const getUser = async () => {
          const { data} = await supabase.auth.getUser();
          const use:any = data?.user
          setUser(use);
        };
    
        getUser();
      }, []); return(
        {user ? }
      )
}
