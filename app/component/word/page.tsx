'use client'
import {supabase} from '../db'
import { useState, useEffect } from 'react'
import Modi from '../modify/modi'

type Word ={
  id: number
  word: string
  def: string
  sino: string
  kont: string

}
export default function Words() {
  const [wo, setWo] =useState<Word[]>([])
  const [loding, setLoding] = useState(true)
  const [name, setName] = useState("bon")
  
  const fetchWords = async () => {
    const { data, error } = await supabase.from('words').select('*')
    if (error) console.error(error)
    else setWo(data)
    setLoding(false)
  }

  useEffect(()=> { 
    fetchWords()
  }, [])
         

  const n = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  const fil= wo.filter(wd =>wd.word === n)

  const handleDelete = () => {
    fetchWords() // Refresh the list after deletion
    setName("bon") // Reset selection
  }

    

    return(
      <div className='min-h-screen bg-white'>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Diksyone Kreyòl</h1>
          
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Words List */}
            <div className="border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
                Mo Disponib
              </h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                {wo.map((word) => (
                  <li key={word.id}>
                    <button 
                      onClick={() => setName(word.word)}
                      className="w-full text-left px-3 py-2 hover:bg-black hover:text-white transition-colors duration-200 border border-transparent hover:border-black"
                    >
                      {word.word}
                    </button> 
                  </li>
                ))}
              </ul>
            </div>

            {/* Word Details */}
            <div className='border border-gray-200 p-6'>
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
                Detay Mo
              </h2>
              {loding ? (
                <p className="text-center text-gray-600">Chaje...</p>
              ) : (
                <div>
                  {fil.length > 0 ? (
                    fil.map((word) => (
                      <div key={word.id}>
                        <Modi mo={word.word} de={word.def} si={word.sino} ant={word.kont} di={word.id} onDelete={handleDelete} />
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600">Chwazi yon mo pou wè detay li</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
}