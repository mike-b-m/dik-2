import { useState, useEffect} from "react";
import { supabase } from "../db";

type ModiProps = {
  mo: string
  de: string
  si: string
  ant: string
  di: number
  onDelete?: () => void
}

export default function Modi({mo, de, si, ant, di, onDelete}: ModiProps){
   const [word, setWord]=useState("")
   const [def, setDef] = useState("")
   const [sino, setSino] = useState("")
   const [kont, setKont] = useState("")
   const [saved, setSaved] = useState(false)
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
   const [showPreview, setShowPreview] = useState(false)
   const [deleteSuccess, setDeleteSuccess] = useState(false)
   const [deleteError, setDeleteError] = useState(false)
   const [isAdmin, setIsAdmin] = useState(false)
   
   useEffect(()=>{
    setWord(mo)
    setDef(de)
    setSino(si)
    setKont(ant)
    checkAdminStatus()
   },[mo, de, si, ant])

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

   const handleEdit = () => {
      setShowPreview(false)
   }

   const dab = async ()=>{
      const { error } = await supabase.from('words').update({word, def,sino,kont}).eq('id',di).select("*")
      if (error) console.error(error) 
      else {
        setSaved(true)
        setShowPreview(false)
        setTimeout(() => setSaved(false), 2000)
      }
   }

   const handleDelete = async () => {
      console.log('Attempting to delete word with ID:', di)
      const { data, error } = await supabase.from('words').delete().eq('id', di).select()
      
      if (error) {
        console.error('Delete error:', error)
        setDeleteError(true)
        setShowDeleteConfirm(false)
        setTimeout(() => setDeleteError(false), 3000)
      } else {
        console.log('Delete successful:', data)
        setShowDeleteConfirm(false)
        setDeleteSuccess(true)
        setTimeout(() => {
          setDeleteSuccess(false)
          if (onDelete) onDelete()
        }, 2000)
      }
   }
                
    
      return(
        <div className="space-y-2">
          {saved && (
            <div className="p-2 bg-black text-white text-center text-sm">
              Chanjman yo te anrejistre!
            </div>
          )}

          {deleteSuccess && (
            <div className="p-2 bg-red-600 text-white text-center text-sm">
              Mo a te efase avèk siksè!
            </div>
          )}

          {deleteError && (
            <div className="p-2 bg-red-600 text-white text-center text-sm">
              Erè! Mo a pa te ka efase. Gade konsol la pou plis detay.
            </div>
          )}
          
          {!showPreview ? (
            <form onSubmit={handlePreview} className="space-y-2">
              <div>
                <label className="block text-sm font-semibold mb-1">Mo</label>
                <input 
                  type="text" 
                  value={word} 
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black text-sm" 
                  placeholder="mo" 
                  onChange={(e)=>setWord(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Definisyon</label>
                <textarea  
                  value={def} 
                  onChange={(e)=>setDef(e.target.value)} 
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black resize-none text-sm" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Sinonim</label>
                <textarea  
                  value={sino} 
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black resize-none text-sm" 
                  onChange={(e)=>setSino(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Antonim</label>
                <textarea 
                  value={kont} 
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black resize-none text-sm"
                  onChange={(e)=>setKont(e.target.value)} 
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-1.5">
                <button 
                  type="submit"
                  className="flex-1 bg-black text-white hover:bg-gray-800 py-2 text-sm transition-colors duration-200"
                >
                  Revize
                </button>
                
                {isAdmin && (
                  <button 
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 bg-white text-black border border-black hover:bg-red-600 hover:text-white hover:border-red-600 py-2 text-sm transition-colors duration-200"
                  >
                    Efase
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <div className="bg-gray-50 border-2 border-black p-2 sm:p-3">
                <h3 className="text-sm font-bold mb-2 border-b-2 border-black pb-1">Revizyon</h3>
                
                <div className="space-y-1.5">
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

              <div className="flex flex-col sm:flex-row gap-1.5">
                <button 
                  onClick={handleEdit}
                  className="flex-1 bg-white text-black border-2 border-black hover:bg-gray-100 py-2 text-sm transition-colors duration-200"
                >
                  Modifye
                </button>
                <button 
                  onClick={dab}
                  className="flex-1 bg-black text-white hover:bg-gray-800 py-2 text-sm transition-colors duration-200"
                >
                  Konfime
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
              <div className="bg-white border-2 border-black p-4 sm:p-5 md:p-6 max-w-[90%] sm:max-w-md w-full">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4">Konfime Efasman</h3>
                <p className="mb-4 sm:mb-5 text-xs sm:text-sm md:text-base">Èske ou sèten ou vle efase mo &ldquo;{word}&rdquo;? Aksyon sa a pa ka defèt.</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white hover:bg-red-700 py-2 sm:py-2.5 text-sm sm:text-base transition-colors duration-200"
                  >
                    Wi, Efase
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-white border-2 border-black hover:bg-gray-100 py-2 sm:py-2.5 text-sm sm:text-base transition-colors duration-200"
                  >
                    Anile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )
}