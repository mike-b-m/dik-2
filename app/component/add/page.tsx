'use client'
import { useState, useEffect } from "react";
import { supabase } from "../db";
//import { Space_Mono } from "next/font/google";

export default function Add(){
    const [word, setWord] = useState("")
  const [def, setDef] = useState("")
  const [sino, setSino] = useState<string[]>([""])
  const [kont, setKont] = useState<string[]>([""])
  const [exemple,setExemple] = useState<string[]>([""])
  const [success, setSuccess] = useState(false)
  const [etimologie,setEtimologie]= useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [api,setApi] = useState('')
  const [nature,setNature] = useState('')

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .single()
      
      setIsAdmin(!!adminData)
    }
  }

   const handlePreview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowPreview(true)
   }
   // for handle synonime
   const handleListSynonym = (index: number, field: string, value: string) => {
    const newRows = [...sino]
    newRows[index] = value 
    setSino(newRows)

  }
  const addRow = () => {
    setSino([...sino, ''])
  }
  const removeRow = (index: number) => {
    if (sino.length > 1) {
      setSino(sino.filter((_, i) => i !== index))
    }
  }

  // for handle antonim
   const handleListKont = (index: number, field: string, value: string) => {
    const newRows = [...kont]
    newRows[index] = value 
    setKont(newRows)

  }
  const addkont = () => {
    setKont([...kont, ''])
  }
  const removeKont = (index: number) => {
    if (kont.length > 1) {
      setKont(kont.filter((_, i) => i !== index))
    }
  }

  // for handle exenple
   const handleListExemple = (index: number, field: string, value: string) => {
    const newRows = [...exemple]
    newRows[index] = value 
    setExemple(newRows)

  }
  const addExemple = () => {
    setExemple([...exemple, ''])
  }
  const removeExemple = (index: number) => {
    if (exemple.length > 1) {
      setExemple(exemple.filter((_, i) => i !== index))
    }
  }
   const HandleSubmit = async () => {
            // Get current user for submitted_by field
            const { data: { user } } = await supabase.auth.getUser()
            
            // Check if user is admin
            let isAdmin = false
            if (user) {
              const { data: adminData } = await supabase
                .from('admin_users')
                .select('*')
                .eq('email', user.email)
                .single()
              
              isAdmin = !!adminData
            }
            
            const {data, error} = await supabase.from('words')
            .insert([{
              word, 
              def,
              sino, 
              kont,
              etymology: etimologie,
              api,
              exemple,
              nature,
              approved: isAdmin, // Auto-approve if admin, otherwise needs approval
              submitted_by: user?.id
            }])
    
            if (error) console.error('Error:', error.message)
            else {
              console.log('saved:', data)
              setSuccess(true)
              setWord("")
              setDef("")
              setSino([])
              setKont([])
              setEtimologie("")
              setApi("")
              setNature("")
              setExemple([])  
              setShowPreview(false)
              setTimeout(() => setSuccess(false), 3000)
            }
  }

  const handleEdit = () => {
    setShowPreview(false)
  }

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="bg-white border border-gray-200 p-3 sm:p-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Ajoute Nouvo Mo</h2>
        
        {success && (
          <div className="mb-3 p-2 bg-black text-white text-center text-sm">
            {isAdmin ? 'Mo a te ajoute avèk siksè!' : 'Mo a te soumèt avèk siksè! Li ap tann apwobasyon.'}
          </div>
        )}
        
        {!showPreview ? (
          <form onSubmit={handlePreview} className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Mo</label>
                <input 
                  type="text" 
                  placeholder="Antre mo a" 
                  name="word" 
                  value={word}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black text-sm"
                  onChange={e => setWord(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Api</label>
                <input 
                  type="text" 
                  placeholder="Api mo a" 
                  name="api" 
                  value={api}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black text-sm"
                  onChange={e => setApi(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Nati mo a</label>
                <input 
                  type="text" 
                  placeholder="nati mo a" 
                  name="nature" 
                  value={nature}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black text-sm"
                  onChange={e => setNature(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Definisyon</label>
                <textarea  
                  placeholder="Definisyon mo a" 
                  name="def" 
                  value={def} 
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black resize-none text-sm"
                  onChange={e => setDef(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Etimologie</label>
                <textarea  
                  placeholder="Etimologie mo a" 
                  name="etimologie" 
                  value={etimologie}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black text-sm"
                  onChange={e => setEtimologie(e.target.value)}
                  required
                />
              </div>

              {/* sinonim section */}
              <div>
                <div>
                  <label className="font-semibold mb-1 mr-5">Sinonim {sino.length}</label>
                  <button 
                    type="button" 
                    onClick={addRow}
                    className="bg-black text-white hover:bg-gray-800 px-4 py-1 mb-2 text-sm transition-colors duration-200"
                  >
                    Ajoute Sinonim
                  </button>
                </div>
                {sino.map((syn, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <div>
                      {sino.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeRow(index)}
                          className="ml-auto px-2 py-1 text-red-600 hover:bg-red-100 rounded transition-all"
                        >
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                      )}
                    </div>
                    <label className="block text-sm font-semibold mb-1">Sinonim</label>
                    <input
                      type="text"
                      placeholder="Sinonim"
                      value={syn}
                      onChange={(e) => handleListSynonym(index, 'sino', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black text-sm"
                    />
                  </div>
                ))}
              </div>
              {/* antonim section */}
              <div>
                <div>
                  <label className="font-semibold mb-1 mr-5">Antonim {kont.length}</label>
                  <button 
                    type="button" 
                    onClick={addkont}
                    className="bg-black text-white hover:bg-gray-800 px-4 py-1 text-sm transition-colors duration-200 mb-2"
                  >
                    Ajoute Antonim
                  </button>
                </div>
                {kont.map((ant, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <div>
                      {kont.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeKont(index)}
                          className="ml-auto px-2 py-1 text-red-600 hover:bg-red-100 rounded transition-all"
                        >
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                      )}
                    </div>
                    <label className="block text-sm font-semibold mb-1">Antonim</label>
                    <input
                      type="text"
                      placeholder="Antonim"
                      value={ant}
                      onChange={(e) => handleListKont(index, 'kont', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* exemple section */}
              <div>
                <div>
                  <label className="font-semibold mb-1 mr-5">Examp {kont.length}</label>
                  <button 
                    type="button" 
                    onClick={addExemple}
                    className="bg-black text-white hover:bg-gray-800 px-4 py-1 text-sm transition-colors duration-200 mb-2"
                  >
                    Ajoute Examp
                  </button>
                </div>
                {exemple.map((ex, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <div>
                      {exemple.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeExemple(index)}
                          className="ml-auto px-2 py-1 text-red-600 hover:bg-red-100 rounded transition-all"
                        >
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                      )}
                    </div>
                    <label className="block text-sm font-semibold mb-1">Examp</label>
                    <input
                      type="text"
                      placeholder="Examp"
                      value={ex}
                      onChange={(e) => handleListExemple(index, 'exemple', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <button 
                type="submit"
                className="bg-black text-white hover:bg-gray-800 px-6 sm:px-8 py-2 text-sm transition-colors duration-200 w-full sm:w-auto"
              >
                Revize Anvan Ajoute
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="bg-gray-50 border-2 border-black p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-bold mb-2 border-b-2 border-black pb-1">Revizyon</h3>
              
              <div className="space-y-2">
                <div>
                  <h4 className="font-semibold text-sm mb-0.5">Mo:</h4>
                  <p className="text-gray-700 text-sm">{word}</p>
                </div>


                <div>
                  <h4 className="font-semibold text-sm mb-0.5">Api:</h4>
                  <p className="text-gray-700 text-sm">{api}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-0.5">Etimoloji</h4>
                  <p className="text-gray-700 text-sm">{etimologie}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-0.5">Definisyon:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{def}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-0.5">Exemp:</h4>
                  <p className="text-gray-700 text-sm">
                    <ol className="list-disc list-inside">
                      {exemple.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ol>
                  </p>
                </div>

                {sino && (
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5">Sinonim:</h4>
                    <p className="text-gray-700 text-sm">{sino.map(s=><span key={s}>{s}, </span>)}</p>
                  </div>
                )}

                {kont && (
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5">Antonim:</h4>
                    <p className="text-gray-700 text-sm">{kont.map(k=><span key={k}>{k}, </span>)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button 
                onClick={handleEdit}
                className="flex-1 bg-white text-black border-2 border-black hover:bg-gray-100 py-2 text-sm transition-colors duration-200"
              >
                Modifye
              </button>
              <button 
                onClick={HandleSubmit}
                className="flex-1 bg-black text-white hover:bg-gray-800 py-2 text-sm transition-colors duration-200"
              >
                Konfime epi Ajoute
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}