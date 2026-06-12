import { useState, useEffect } from "react";
import { supabase } from "../db";
import { WordRow, NATURE_OPTIONS, toList, fromList, linesToList, listToLines } from "../wordUtils";

type ModiProps = {
  entry: WordRow
  onDelete?: () => void
  onSaved?: () => void
}

const inputCls =
  "w-full px-3 py-2 bg-white border border-mist rounded-lg text-sm focus:outline-none focus:border-blueht focus:ring-2 focus:ring-blueht/15 transition-all";
const labelCls = "block text-xs font-semibold mb-1";

export default function Modi({ entry, onDelete, onSaved }: ModiProps) {
  const [word, setWord] = useState("")
  const [nature, setNature] = useState("")
  const [def, setDef] = useState("")
  const [api, setApi] = useState("")
  const [sino, setSino] = useState("")
  const [kont, setKont] = useState("")
  const [exemple, setExemple] = useState("")
  const [etymology, setEtymology] = useState("")
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setWord(entry.word)
    setNature(entry.nature ?? "")
    setDef(entry.def ?? "")
    setApi(entry.api ?? "")
    setSino(fromList(entry.sino))
    setKont(fromList(entry.kont))
    setExemple(listToLines(entry.exemple))
    setEtymology(entry.etymology ?? "")

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
    checkAdminStatus()
  }, [entry])

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase
      .from('words')
      .update({
        word: word.trim(),
        def: def.trim(),
        nature: nature || null,
        api: api.trim() || null,
        sino: toList(sino),
        kont: toList(kont),
        exemple: linesToList(exemple),
        etymology: etymology.trim() || null,
      })
      .eq('id', entry.id)
    setSaving(false)
    if (error) console.error(error)
    else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      if (onSaved) onSaved()
    }
  }

  const handleDelete = async () => {
    const { error } = await supabase.from('words').delete().eq('id', entry.id)
    if (error) {
      console.error('Delete error:', error)
      setDeleteError(true)
      setShowDeleteConfirm(false)
      setTimeout(() => setDeleteError(false), 3000)
    } else {
      setShowDeleteConfirm(false)
      if (onDelete) onDelete()
    }
  }

  return (
    <div className="space-y-3">
      {saved && (
        <div className="p-2.5 rounded-lg bg-blueht text-white text-center text-sm">
          Chanjman yo anrejistre!
        </div>
      )}
      {deleteError && (
        <div className="p-2.5 rounded-lg bg-redht text-white text-center text-sm">
          Erè! Mo a pa t ka efase.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Mo</label>
            <input type="text" value={word} className={`${inputCls} font-display`} onChange={(e) => setWord(e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Nati</label>
            <select value={nature} onChange={(e) => setNature(e.target.value)} className={inputCls}>
              <option value="">Chwazi…</option>
              {NATURE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Definisyon</label>
          <textarea value={def} onChange={(e) => setDef(e.target.value)} rows={3} className={`${inputCls} resize-none`} required />
        </div>

        <div>
          <label className={labelCls}>Egzanp (yon fraz pa liy)</label>
          <textarea value={exemple} onChange={(e) => setExemple(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Sinonim (separe ak vigil)</label>
            <textarea value={sino} rows={2} className={`${inputCls} resize-none`} onChange={(e) => setSino(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Antonim (separe ak vigil)</label>
            <textarea value={kont} rows={2} className={`${inputCls} resize-none`} onChange={(e) => setKont(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Pwononsyasyon (API)</label>
            <input type="text" value={api} className={`${inputCls} font-mono`} onChange={(e) => setApi(e.target.value)} placeholder="/lɑ̃.mu/" />
          </div>
          <div>
            <label className={labelCls}>Etimoloji</label>
            <input type="text" value={etymology} className={inputCls} onChange={(e) => setEtymology(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blueht text-white hover:bg-blueht-deep py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-60"
          >
            {saving ? 'Anrejistreman…' : 'Anrejistre chanjman yo'}
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 bg-white text-redht border border-redht hover:bg-redht hover:text-white py-2 rounded-full text-sm font-medium transition-colors"
            >
              Efase mo a
            </button>
          )}
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-mist shadow-xl p-6 max-w-md w-full">
            <h3 className="font-display text-xl font-bold mb-3">Konfime efasman</h3>
            <p className="mb-5 text-sm text-ink-soft">
              Èske ou sèten ou vle efase mo « {word} » ? Aksyon sa a pa ka defèt.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 bg-redht text-white hover:bg-[#a90d2a] py-2.5 rounded-full text-sm font-medium transition-colors"
              >
                Wi, efase
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-white border border-mist hover:border-blueht py-2.5 rounded-full text-sm font-medium transition-colors"
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
