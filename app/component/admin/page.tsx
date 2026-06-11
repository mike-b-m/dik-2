'use client'
import { useEffect, useState, useCallback } from 'react'
import { sendGAEvent } from '@next/third-parties/google'
import { supabase } from '../db'
import { useRouter } from 'next/navigation'
import { WordRow, fromList } from '../wordUtils'

type AdminUser = {
  id: string
  email: string
  is_super_admin: boolean
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [currentUserEmail, setCurrentUserEmail] = useState('')

  const [pendingWords, setPendingWords] = useState<WordRow[]>([])
  const [loadingWords, setLoadingWords] = useState(true)

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminIsSuper, setNewAdminIsSuper] = useState(false)
  const [addingAdmin, setAddingAdmin] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const fetchPendingWords = async () => {
    setLoadingWords(true)
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false })

    if (error) console.error('Error fetching pending words:', error)
    else setPendingWords(data || [])
    setLoadingWords(false)
  }

  const fetchAdminUsers = async () => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Error fetching admin users:', error)
    else setAdminUsers(data || [])
  }

  const checkAdminAccess = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/component/login')
        return
      }
      setCurrentUserEmail(user.email || '')

      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .single()

      if (adminError || !adminData) {
        setLoading(false)
        return
      }

      setIsAdmin(true)
      setIsSuperAdmin(adminData.is_super_admin)
      await fetchPendingWords()
      if (adminData.is_super_admin) {
        await fetchAdminUsers()
      }
      setLoading(false)
    } catch (error) {
      console.error('Error checking admin access:', error)
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkAdminAccess()
  }, [checkAdminAccess])

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 4000)
  }

  const approveWord = async (wordId: number) => {
    const { error } = await supabase
      .from('words')
      .update({ approved: true })
      .eq('id', wordId)

    if (error) {
      console.error('Error approving word:', error)
      showMessage('Erè pandan apwobasyon', 'error')
    } else {
      sendGAEvent('event', 'word_approved', { word_id: String(wordId) })
      showMessage('Mo apwouve avèk siksè!', 'success')
      await fetchPendingWords()
    }
  }

  const rejectWord = async (wordId: number) => {
    const { error } = await supabase
      .from('words')
      .delete()
      .eq('id', wordId)

    if (error) {
      console.error('Error rejecting word:', error)
      showMessage('Erè pandan rejè', 'error')
    } else {
      sendGAEvent('event', 'word_rejected', { word_id: String(wordId) })
      showMessage('Mo a rejte e efase', 'success')
      await fetchPendingWords()
    }
  }

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) {
      showMessage('Tanpri antre yon adrès imel', 'error')
      return
    }
    setAddingAdmin(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('admin_users')
      .insert([{
        email: newAdminEmail.trim().toLowerCase(),
        is_super_admin: newAdminIsSuper,
        created_by: user?.id
      }])

    if (error) {
      console.error('Error adding admin:', error)
      if (error.code === '23505') {
        showMessage('Itilizatè sa a se yon admin deja', 'error')
      } else {
        showMessage('Erè pandan ajoute admin', 'error')
      }
    } else {
      showMessage(newAdminIsSuper ? 'Super admin ajoute avèk siksè!' : 'Admin ajoute avèk siksè!', 'success')
      setNewAdminEmail('')
      setNewAdminIsSuper(false)
      await fetchAdminUsers()
    }
    setAddingAdmin(false)
  }

  const removeAdmin = async (adminId: string, email: string) => {
    if (email === currentUserEmail) {
      showMessage('Ou pa ka retire tèt ou kòm admin', 'error')
      return
    }
    if (!confirm(`Èske ou sèten ou vle retire ${email} kòm admin?`)) {
      return
    }
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminId)

    if (error) {
      console.error('Error removing admin:', error)
      showMessage('Erè pandan retire admin', 'error')
    } else {
      showMessage('Admin retire avèk siksè', 'success')
      await fetchAdminUsers()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink-soft italic">Chajman…</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white border border-mist rounded-2xl shadow-sm p-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-3">Aksè refize</h1>
          <p className="text-ink-soft mb-6 text-sm">Ou pa gen pèmisyon pou aksede paj sa a.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blueht text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-blueht-deep transition-colors"
          >
            Retounen nan paj akèy
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-redht font-semibold mb-1">
            Administrasyon
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Tablodbò</h1>
            {isSuperAdmin && (
              <span className="text-[10px] uppercase tracking-wide bg-gold/20 text-[#8a6414] font-bold px-2 py-0.5 rounded-full">
                Super admin
              </span>
            )}
          </div>
          <p className="text-sm text-ink-soft mt-1">{currentUserEmail}</p>
        </div>

        {message && (
          <div className={`mb-5 p-3 rounded-xl text-sm text-white text-center ${messageType === 'success' ? 'bg-blueht' : 'bg-redht'}`}>
            {message}
          </div>
        )}

        {/* Pending Words */}
        <div className="bg-white border border-mist rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
          <h2 className="text-xs uppercase tracking-widest text-ink-soft font-semibold mb-4">
            Mo k ap tann apwobasyon ({pendingWords.length})
          </h2>

          {loadingWords ? (
            <p className="text-sm text-ink-soft italic py-3">Chajman…</p>
          ) : pendingWords.length === 0 ? (
            <p className="text-sm text-ink-soft py-4 text-center">
              Pa gen mo k ap tann — tout bagay ajou!
            </p>
          ) : (
            <div className="space-y-3">
              {pendingWords.map((word) => (
                <div key={word.id} className="border border-mist rounded-xl p-4 bg-paper">
                  <div className="flex items-baseline gap-x-3 gap-y-1 flex-wrap mb-1">
                    <h3 className="font-display text-xl font-bold">{word.word}</h3>
                    {word.api && <span className="font-mono text-xs text-ink-soft">{word.api}</span>}
                    {word.nature && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-redht-soft text-redht font-semibold uppercase tracking-wide">
                        {word.nature}
                      </span>
                    )}
                    <span className="text-[11px] text-ink-soft ml-auto">
                      {new Date(word.created_at).toLocaleString('fr-FR', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-ink-soft leading-relaxed mb-2">{word.def}</p>

                  {word.exemple && word.exemple.length > 0 && (
                    <ul className="mb-2 space-y-0.5">
                      {word.exemple.map((ex, i) => (
                        <li key={i} className="font-display italic text-ink-soft/80 text-sm border-l-2 border-blueht/30 pl-3">
                          « {ex} »
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-soft mb-3">
                    {word.sino && word.sino.length > 0 && (
                      <span><span className="font-semibold text-blueht">Sinonim:</span> {fromList(word.sino)}</span>
                    )}
                    {word.kont && word.kont.length > 0 && (
                      <span><span className="font-semibold text-redht">Antonim:</span> {fromList(word.kont)}</span>
                    )}
                    {word.etymology && (
                      <span><span className="font-semibold">Etimoloji:</span> {word.etymology}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => approveWord(word.id)}
                      className="flex-1 bg-blueht text-white hover:bg-blueht-deep py-2 rounded-full text-xs sm:text-sm font-medium transition-colors"
                    >
                      Apwouve
                    </button>
                    <button
                      onClick={() => rejectWord(word.id)}
                      className="flex-1 bg-white text-redht border border-redht hover:bg-redht hover:text-white py-2 rounded-full text-xs sm:text-sm font-medium transition-colors"
                    >
                      Rejte
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Management (Super Admin Only) */}
        {isSuperAdmin && (
          <div className="bg-white border border-mist rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-xs uppercase tracking-widest text-ink-soft font-semibold mb-4">
              Jesyon admin yo
            </h2>

            <div className="mb-5 p-4 bg-paper border border-mist rounded-xl">
              <h3 className="text-sm font-semibold mb-2">Ajoute yon nouvo admin</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="imel@egzanp.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-white border border-mist rounded-full text-sm focus:outline-none focus:border-blueht focus:ring-2 focus:ring-blueht/15 transition-all"
                  disabled={addingAdmin}
                />
                <button
                  onClick={addAdmin}
                  disabled={addingAdmin}
                  className="bg-blueht text-white hover:bg-blueht-deep px-5 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-60 whitespace-nowrap"
                >
                  {addingAdmin ? 'Ajoute…' : 'Ajoute'}
                </button>
              </div>
              <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newAdminIsSuper}
                  onChange={(e) => setNewAdminIsSuper(e.target.checked)}
                  disabled={addingAdmin}
                  className="w-4 h-4 accent-[#00209f]"
                />
                <span className="text-sm">
                  Fè li <span className="font-semibold">super admin</span>
                  <span className="text-ink-soft"> — l ap ka jere lòt admin tou</span>
                </span>
              </label>
            </div>

            <h3 className="text-sm font-semibold mb-2">Lis admin yo ({adminUsers.length})</h3>
            {adminUsers.length === 0 ? (
              <p className="text-sm text-ink-soft py-3">Pa gen admin.</p>
            ) : (
              <div className="space-y-2">
                {adminUsers.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border border-mist rounded-xl bg-paper"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{admin.email}</p>
                      <div className="flex flex-wrap gap-2 mt-0.5 items-center">
                        {admin.is_super_admin && (
                          <span className="text-[9px] uppercase tracking-wide bg-gold/20 text-[#8a6414] font-bold px-1.5 py-0.5 rounded-full">
                            Super
                          </span>
                        )}
                        <span className="text-[11px] text-ink-soft">
                          depi {new Date(admin.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    {!admin.is_super_admin && admin.email !== currentUserEmail && (
                      <button
                        onClick={() => removeAdmin(admin.id, admin.email)}
                        className="text-redht border border-redht hover:bg-redht hover:text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap"
                      >
                        Retire
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
