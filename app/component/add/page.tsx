'use client'
import { useState, useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { supabase } from "../db";
import { NATURE_OPTIONS, toList, linesToList } from "../wordUtils";

const inputCls =
  "w-full px-3.5 py-2.5 bg-white border border-mist rounded-xl text-sm focus:outline-none focus:border-blueht focus:ring-2 focus:ring-blueht/15 transition-all placeholder:text-ink-soft/50";
const labelCls = "block text-sm font-semibold mb-1.5";
const hintCls = "block text-xs text-ink-soft font-normal mt-0.5";

export default function Add() {
  const [word, setWord] = useState("")
  const [nature, setNature] = useState("")
  const [def, setDef] = useState("")
  const [api, setApi] = useState("")
  const [sino, setSino] = useState("")
  const [kont, setKont] = useState("")
  const [exemple, setExemple] = useState("")
  const [etymology, setEtymology] = useState("")
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
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
  }, [])

  const handlePreview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowPreview(true)
  }

  const handleSubmit = async () => {
    setSaving(true)
    setErrorMsg("")
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('words').insert([{
      word: word.trim(),
      def: def.trim(),
      nature: nature || null,
      api: api.trim() || null,
      sino: toList(sino),
      kont: toList(kont),
      exemple: linesToList(exemple),
      etymology: etymology.trim() || null,
      approved: isAdmin, // admins publish directly; others wait for approval
      submitted_by: user?.id,
    }])

    setSaving(false)
    if (error) {
      console.error('Error:', error)
      setErrorMsg("Yon erè rive pandan anrejistreman an. Tanpri eseye ankò.")
    } else {
      sendGAEvent("event", "word_submitted", { word: word.trim(), auto_approved: String(isAdmin) })
      setSuccess(true)
      setWord(""); setNature(""); setDef(""); setApi("");
      setSino(""); setKont(""); setExemple(""); setEtymology("");
      setShowPreview(false)
      setTimeout(() => setSuccess(false), 4000)
    }
  }

  const previewList = (s: string, lines = false) => {
    const items = lines ? linesToList(s) : toList(s)
    return items.length > 0 ? items : null
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white border border-mist rounded-2xl shadow-sm p-5 sm:p-7">
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-blueht text-white text-center text-sm">
            {isAdmin
              ? 'Mo a pibliye avèk siksè!'
              : 'Mo a soumèt avèk siksè! L ap parèt apre yon admin apwouve li.'}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-redht text-white text-center text-sm">
            {errorMsg}
          </div>
        )}

        {!showPreview ? (
          <form onSubmit={handlePreview} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Mo *</label>
                <input
                  type="text"
                  placeholder="egz. Lanmou"
                  value={word}
                  className={`${inputCls} font-display text-lg`}
                  onChange={e => setWord(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>Nati mo a</label>
                <select
                  value={nature}
                  onChange={e => setNature(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Chwazi…</option>
                  {NATURE_OPTIONS.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>
                Definisyon *
                <span className={hintCls}>Eksplike sans mo a an kreyòl, klè e konplè.</span>
              </label>
              <textarea
                placeholder="egz. Lanmou se yon santiman pwofon afeksyon…"
                value={def}
                rows={3}
                className={`${inputCls} resize-none`}
                onChange={e => setDef(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={labelCls}>
                Egzanp fraz
                <span className={hintCls}>Yon fraz pa liy.</span>
              </label>
              <textarea
                placeholder={"Lanmou fè lavi a pi bèl.\nLanmou yon manman pa gen limit."}
                value={exemple}
                rows={3}
                className={`${inputCls} resize-none`}
                onChange={e => setExemple(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  Sinonim
                  <span className={hintCls}>Separe yo ak vigil.</span>
                </label>
                <textarea
                  placeholder="afeksyon, tandrès, renmen"
                  value={sino}
                  rows={2}
                  className={`${inputCls} resize-none`}
                  onChange={e => setSino(e.target.value)}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Antonim
                  <span className={hintCls}>Separe yo ak vigil.</span>
                </label>
                <textarea
                  placeholder="rayisman, mepri"
                  value={kont}
                  rows={2}
                  className={`${inputCls} resize-none`}
                  onChange={e => setKont(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  Pwononsyasyon (API)
                  <span className={hintCls}>Fakiltatif — fòma /lɑ̃.mu/</span>
                </label>
                <input
                  type="text"
                  placeholder="/lɑ̃.mu/"
                  value={api}
                  className={`${inputCls} font-mono`}
                  onChange={e => setApi(e.target.value)}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Etimoloji
                  <span className={hintCls}>Ki kote mo a soti?</span>
                </label>
                <input
                  type="text"
                  placeholder="Soti nan franse « amour »…"
                  value={etymology}
                  className={inputCls}
                  onChange={e => setEtymology(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="bg-blueht text-white hover:bg-blueht-deep px-8 py-2.5 rounded-full text-sm font-medium transition-colors w-full sm:w-auto"
              >
                Revize anvan ou soumèt
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Preview rendered like the real dictionary entry */}
            <div className="bg-paper border border-mist rounded-2xl p-5 sm:p-6">
              <p className="text-xs uppercase tracking-widest text-redht font-semibold mb-3">
                Revizyon — men kijan antre a ap parèt
              </p>

              <div className="flex items-baseline gap-x-3 gap-y-1 flex-wrap">
                <h3 className="font-display text-3xl font-bold">{word}</h3>
                {api && <span className="font-mono text-ink-soft text-sm">{api}</span>}
                {nature && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-redht-soft text-redht font-semibold uppercase tracking-wide">
                    {nature}
                  </span>
                )}
              </div>

              <div className="tricolor-rule my-4 max-w-[100px]" />

              <p className="leading-relaxed mb-4">{def}</p>

              {previewList(exemple, true) && (
                <div className="mb-4">
                  <h4 className="text-xs uppercase tracking-widest text-ink-soft font-semibold mb-1.5">Egzanp</h4>
                  <ul className="space-y-1 border-l-2 border-blueht/30 pl-3">
                    {previewList(exemple, true)!.map((ex, i) => (
                      <li key={i} className="font-display italic text-ink-soft text-sm">« {ex} »</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {previewList(sino) && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-ink-soft font-semibold mb-1.5">Sinonim</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {previewList(sino)!.map(s => (
                        <span key={s} className="px-2.5 py-0.5 rounded-full bg-blueht-soft text-blueht text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {previewList(kont) && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-ink-soft font-semibold mb-1.5">Antonim</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {previewList(kont)!.map(k => (
                        <span key={k} className="px-2.5 py-0.5 rounded-full bg-redht-soft text-redht text-xs">{k}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {etymology && (
                <div className="bg-white border border-mist rounded-xl p-3">
                  <h4 className="text-xs uppercase tracking-widest text-ink-soft font-semibold mb-1">Etimoloji</h4>
                  <p className="text-sm text-ink-soft">{etymology}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 bg-white text-ink border border-mist hover:border-blueht hover:text-blueht py-2.5 rounded-full text-sm font-medium transition-colors"
              >
                ← Modifye
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 bg-blueht text-white hover:bg-blueht-deep py-2.5 rounded-full text-sm font-medium transition-colors disabled:opacity-60"
              >
                {saving ? 'Anrejistreman…' : isAdmin ? 'Konfime epi pibliye' : 'Konfime epi soumèt'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
