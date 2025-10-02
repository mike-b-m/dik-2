'use client'
import { useState } from "react";
import { supabase } from "../db";

export default function Add(){
    const [word, setWord] = useState("")
  const [def, setDef] = useState("")
  const [sino, setSino] = useState("")
  const [kont, setKont] = useState("")

   const HandleSubmit = async (e:any) => {
    e.preventDefault()
            const {data, error} = await supabase.from('words')
            .insert([{word, def,sino, kont }])
    
            if (error) console.error('Error:', error)
            else console.log('saved:', data)
  }
  return (
    <>
    <div>
      <h1 className="bg-clo font-bold m-2 lg:ml-15  lg:mt-6 pl-2">ajoute nouvo mo non lis la.</h1> <form  onSubmit={HandleSubmit} className="grid grid-cols-2 text-center">
        <input type="text" placeholder="Mo" name="word" value={word}
        className="w-90 mt-4 shadow-lg"
        onChange={e => setWord(e.target.value)} />

        <textarea  placeholder="definisyon" name="def" value={def} 
        className="w-90 mt-4 h-25 shadow-lg"
        onChange={e => setDef(e.target.value)}/>
        <textarea  placeholder="sinonim" name="sino" value={sino} 
        className="w-90 mt-4 h-25 shadow-lg"
        onChange={e => setSino(e.target.value)}/>
        
        <textarea  placeholder="antonim" name="kont" value={kont} 
        className="w-90 mt-4 h-25 shadow-lg"
        onChange={e => setKont(e.target.value)}/>
        
        <button className="bg-clo shadow-lg m-3 p-1 w-25 rounded-2xl">modifye</button>
      </form>
      </div>
    </>
  )
}