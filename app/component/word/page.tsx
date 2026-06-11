'use client'
import { supabase } from '../db'
import { useState, useEffect } from 'react'
import Modi from '../modify/modi'
import { WordRow } from '../wordUtils'

export default function Words() {
  const [words, setWords] = useState<WordRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const fetchWords = async () => {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .order('word', { ascending: true })
    if (error) console.error(error)
    else setWords(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const selected = words.find((w) => w.id === selectedId) || null

  const handleChanged = () => {
    fetchWords()
    setSelectedId(null)
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-8 text-center">
          Modifye yon mo
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Words List */}
          <div className="bg-white border border-mist rounded-2xl shadow-sm p-5">
            <h2 className="text-xs uppercase tracking-widest text-ink-soft font-semibold mb-4">
              Mo disponib ({words.length})
            </h2>
            {loading ? (
              <p className="text-center text-ink-soft italic text-sm py-6">Chajman…</p>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[60vh] overflow-y-auto pr-1">
                {words.map((word) => (
                  <li key={word.id}>
                    <button
                      onClick={() => setSelectedId(word.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedId === word.id
                          ? 'bg-blueht text-white'
                          : 'hover:bg-blueht-soft hover:text-blueht'
                      }`}
                    >
                      {word.word}
                      {!word.approved && (
                        <span className="ml-1.5 text-[9px] uppercase font-bold opacity-70">(annatant)</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Word Details */}
          <div className='bg-white border border-mist rounded-2xl shadow-sm p-5'>
            <h2 className="text-xs uppercase tracking-widest text-ink-soft font-semibold mb-4">
              Detay mo a
            </h2>
            {selected ? (
              <Modi entry={selected} onDelete={handleChanged} onSaved={handleChanged} />
            ) : (
              <p className="text-center text-ink-soft text-sm py-10">
                Chwazi yon mo agoch pou wè epi modifye detay li.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
