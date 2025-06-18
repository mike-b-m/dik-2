'use client'
import {supabase} from '../db'
import { useState, useEffect } from 'react'
import Modi from '../modify/modi'

type user ={
  id: number
  word: string
  def: string
  sino: string
  kont: string

}
export default function Words() {
  const [wo, setWo] =useState<user[]>([])
  const [loding, setLoding] = useState(true)
  const [name, setName] = useState("bon")
  
        useEffect(()=> { const dab = async ()=>{
        const { data, error } = await supabase.from('words').select('*')
        if (error) console.error(error)
        else setWo(data)
        setLoding(false)  
        }
        dab()
        }, [])
         

        const n = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        const fil= wo.filter(wd =>wd.word === n)

    

    return(
        <>
        <div className='grid grid-cols-2 '>

         <div className="">
    <h1 className="bg-clo font-bold m-2 lg:ml-15  lg:mt-6 pl-2">Mo disponib:</h1>
    <ul className="lg:ml-16 lg:columns-5  columns-2 ">
        {wo.map((user) => (
        <li key={user.id}>
          <button onClick={e =>setName(user.word)}>
          {user.word}
          </button> 
        </li>
        ))}
      </ul></div>

       <div className='object-left ' style={{ padding: 20 }}>
    
    {loding ? (
      <p>Loding...</p>
    ) : (
      <ul className=" md:pl-10 md:text-lg text-sm">
        {fil.map((user:any) => (
          <li key={user.id}>
            
            <Modi mo={user.word} de={user.def} si={user.sino} ant={user.kont} di={user.id} />

          </li>
        ))}
      </ul>
    )}
    
  </div>
           
     
        </div>
    </>
    )
}