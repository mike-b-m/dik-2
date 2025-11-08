'use client'
import { supabase } from '../db'
import { useState, useEffect } from 'react'
import Modi from '../modify/modi'

type Word = {
  id: number
  word: string
  def: string
  sino: string
  kont: string
  approved: boolean
}

export default function AllWords() {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingWordId, setEditingWordId] = useState<number | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [displayCount, setDisplayCount] = useState(20) // Start with 20 words

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

  const fetchWords = async () => {
    await checkAdminStatus()
    
    // Fetch only approved words - everyone sees the same approved words
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('approved', true)
      .order('word', { ascending: true })
    
    if (error) {
      console.error(error)
    } else {
      setWords(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWords()
  }, [])

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      // Check if user is near bottom of page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
        setDisplayCount(prev => Math.min(prev + 20, filteredWords.length))
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [words, searchTerm]) // Re-attach when words or search changes

  const filteredWords = words.filter(word => 
    word.word && word.word.trim() !== "" && word.word.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Only display a subset based on displayCount
  const displayedWords = filteredWords.slice(0, displayCount)

  const handleDelete = () => {
    fetchWords()
    setEditingWordId(null)
  }

  const handleSave = () => {
    fetchWords()
    setEditingWordId(null)
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-[1200px] mx-auto px-3 sm:px-4 py-3 sm:py-4'>
        <div className="mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-center">Tout Mo nan Diksyone a</h1>
          <p className="text-center text-sm text-gray-600 mb-3 sm:mb-4">
            {filteredWords.length} mo {displayedWords.length < filteredWords.length && `(${displayedWords.length} montre)`}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-[95%] sm:max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Chèche yon mo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black text-sm"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 text-sm">Chaje...</p>
        ) : (
          <div className="space-y-3">
            {displayedWords.length > 0 ? (
              <>
                {displayedWords.map((word) => (
                <div key={word.id} className="border border-gray-200 hover:border-black transition-colors duration-200">
                  <div className="p-3 sm:p-4">
                    {/* Header with Edit Icon */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h2 className="text-base sm:text-lg md:text-xl font-bold border-b-2 border-black pb-1 inline-block break-words">
                        {word.word}
                      </h2>
                      <button
                        onClick={() => setEditingWordId(editingWordId === word.id ? null : word.id)}
                        className="flex items-center gap-1 px-2 py-1 border border-black hover:bg-black hover:text-white transition-colors duration-200 text-xs whitespace-nowrap flex-shrink-0"
                        title={editingWordId === word.id ? 'Fèmen' : 'Modifye mo'}
                      >
                        {editingWordId === word.id ? (
                          // X (Close) icon
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          // Pencil (Edit) icon
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        )}
                        <span className="hidden sm:inline">{editingWordId === word.id ? 'Fèmen' : 'Modifye'}</span>
                      </button>
                    </div>
                    
                    {/* Edit Mode */}
                    {editingWordId === word.id ? (
                      <Modi 
                        mo={word.word} 
                        de={word.def} 
                        si={word.sino} 
                        ant={word.kont} 
                        di={word.id} 
                        onDelete={handleDelete}
                      />
                    ) : (
                      /* View Mode */
                      <div className="space-y-2 mt-2">
                        <div>
                          <h3 className="font-semibold text-xs sm:text-sm mb-1">Definisyon:</h3>
                          <p className="text-gray-700 leading-relaxed text-sm">{word.def || "Pa gen definisyon"}</p>
                        </div>

                        {word.sino && (
                          <div>
                            <h3 className="font-semibold text-xs sm:text-sm mb-1">Sinonim:</h3>
                            <p className="text-gray-700 text-sm">{word.sino}</p>
                          </div>
                        )}

                        {word.kont && (
                          <div>
                            <h3 className="font-semibold text-xs sm:text-sm mb-1">Antonim:</h3>
                            <p className="text-gray-700 text-sm">{word.kont}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
                
                {/* Loading indicator when more words are available */}
                {displayedWords.length < filteredWords.length && (
                  <div className="text-center py-4 text-sm text-gray-500">
                    Deplase anba pou wè plis mo...
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-600 py-6 text-sm">
                {searchTerm ? `Pa gen mo ki matche "${searchTerm}"` : "Pa gen mo nan diksyone a"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
