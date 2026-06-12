'use client'
import { supabase } from '../db'
import { useState, useEffect, useCallback } from 'react'
import Modi from '../modify/modi'
import { WordRow, fromList } from '../wordUtils'

export default function AllWords() {
  const [words, setWords] = useState<WordRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingWordId, setEditingWordId] = useState<number | null>(null)
  const [displayCount, setDisplayCount] = useState(20)

  const fetchWords = useCallback(async () => {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('approved', true)
      .order('word', { ascending: true })

    if (error) console.error(error)
    else setWords(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchWords()
  }, [fetchWords])

  const filteredWords = words.filter(w =>
    w.word && w.word.trim() !== "" && w.word.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
        setDisplayCount(prev => Math.min(prev + 20, filteredWords.length))
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [filteredWords.length])

  const displayedWords = filteredWords.slice(0, displayCount)

  const handleChanged = () => {
    fetchWords()
    setEditingWordId(null)
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">
            Tout mo nan diksyonè a
          </h1>
          <p className="text-sm text-ink-soft mb-5">
            {filteredWords.length} mo{displayedWords.length < filteredWords.length && ` — ${displayedWords.length} montre`}
          </p>

          <div className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Chèche yon mo…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-mist rounded-full text-sm focus:outline-none focus:border-blueht focus:ring-2 focus:ring-blueht/15 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-ink-soft italic text-sm py-8">Chajman…</p>
        ) : (
          <div className="space-y-3">
            {displayedWords.length > 0 ? (
              <>
                {displayedWords.map((word) => (
                  <div key={word.id} className="bg-white border border-mist rounded-2xl hover:border-blueht/40 transition-colors shadow-sm">
                    <div className="p-4 sm:p-5">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <div className="flex items-baseline gap-x-3 gap-y-1 flex-wrap">
                          <h2 className="font-display text-xl sm:text-2xl font-bold break-words">
                            {word.word}
                          </h2>
                          {word.api && (
                            <span className="font-mono text-ink-soft text-xs">{word.api}</span>
                          )}
                          {word.nature && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-redht-soft text-redht font-semibold uppercase tracking-wide">
                              {word.nature}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setEditingWordId(editingWordId === word.id ? null : word.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                            editingWordId === word.id
                              ? 'bg-ink text-white'
                              : 'border border-mist hover:border-blueht hover:text-blueht'
                          }`}
                        >
                          {editingWordId === word.id ? 'Fèmen' : 'Modifye'}
                        </button>
                      </div>

                      {editingWordId === word.id ? (
                        <div className="mt-3">
                          <Modi entry={word} onDelete={handleChanged} onSaved={handleChanged} />
                        </div>
                      ) : (
                        <div className="space-y-2 mt-2">
                          <p className="text-ink-soft leading-relaxed text-sm">
                            {word.def || "Pa gen definisyon"}
                          </p>
                          {word.exemple && word.exemple.length > 0 && (
                            <p className="font-display italic text-ink-soft/80 text-sm border-l-2 border-blueht/30 pl-3">
                              « {word.exemple[0]} »
                            </p>
                          )}
                          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-soft">
                            {word.sino && word.sino.length > 0 && (
                              <span><span className="font-semibold text-blueht">Sinonim:</span> {fromList(word.sino)}</span>
                            )}
                            {word.kont && word.kont.length > 0 && (
                              <span><span className="font-semibold text-redht">Antonim:</span> {fromList(word.kont)}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {displayedWords.length < filteredWords.length && (
                  <div className="text-center py-4 text-sm text-ink-soft italic">
                    Desann pou wè plis mo…
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-ink-soft py-8 text-sm">
                {searchTerm ? `Pa gen mo ki matche « ${searchTerm} »` : "Poko gen mo nan diksyonè a"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
