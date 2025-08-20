import { useState, useEffect} from "react";
import { supabase } from "../db";

export default function Modi({mo, de, si, ant, di}:{mo:any, de:any, si:any, ant:any, di:any}){
   const [word, setWord]=useState("")
   const [def, setDef] = useState("")
   const [sino, setSino] = useState("")
   const [kont, setKont] = useState("")
   
   useEffect(()=>{
    setWord(mo)
    setDef(de)
    setSino(si)
    setKont(ant)},[])
    const dab = async ()=>{
                const { data, error } = await supabase.from('words').update({word, def,sino,kont}).eq('id',di).select("*")
                if (error) console.error(error) 
                }
                dab()
                
        
    
      return(
        <> 
        <form onSubmit={dab} className=" ">
            Mo<input type="text" value={word} 
            className="block shadow-sm" placeholder="mo" onChange={(e)=>setWord(e.target.value)}/>

            Definisyon <textarea  value={def} onChange={(e)=>setDef(e.target.value)} 
            className="w-90 h-45 block shadow-sm" />

            sinonim<textarea  value={sino} 
            className="block w-90 shadow-sm" onChange={(e)=>setSino(e.target.value)}/>

            antonim<textarea value={kont} 
            className="block w-90 shadow-sm"
            onChange={(e)=>setKont(e.target.value)} />
            <button className="bg-clo shadow-lg m-3 p-1 rounded-2xl">save</button>
        </form>
  </>
      )
}