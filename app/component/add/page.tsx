'use client'
import { useState, useEffect } from "react";
import { supabase } from "../db";

export default function Add(){
    const [word, setWord] = useState("")
  const [def, setDef] = useState("")
  const [sino, setSino] = useState("")
  const [kont, setKont] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

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

   const handlePreview = (e:any) => {
    e.preventDefault()
    setShowPreview(true)
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
              approved: isAdmin, // Auto-approve if admin, otherwise needs approval
              submitted_by: user?.id
            }])
    
            if (error) console.error('Error:', error)
            else {
              console.log('saved:', data)
              setSuccess(true)
              setWord("")
              setDef("")
              setSino("")
              setKont("")
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
                <label className="block text-sm font-semibold mb-1">Sinonim</label>
                <textarea  
                  placeholder="Sinonim (opsyonèl)" 
                  name="sino" 
                  value={sino} 
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black resize-none text-sm"
                  onChange={e => setSino(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Antonim</label>
                <textarea  
                  placeholder="Antonim (opsyonèl)" 
                  name="kont" 
                  value={kont} 
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black resize-none text-sm"
                  onChange={e => setKont(e.target.value)}
                />
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
                  <h4 className="font-semibold text-sm mb-0.5">Definisyon:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{def}</p>
                </div>

                {sino && (
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5">Sinonim:</h4>
                    <p className="text-gray-700 text-sm">{sino}</p>
                  </div>
                )}

                {kont && (
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5">Antonim:</h4>
                    <p className="text-gray-700 text-sm">{kont}</p>
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