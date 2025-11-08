'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../db'
import { useRouter } from 'next/navigation'

type Word = {
  id: number
  word: string
  def: string
  sino: string
  kont: string
  approved: boolean
  created_at: string
  submitted_by: string
}

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
  
  // Pending words state
  const [pendingWords, setPendingWords] = useState<Word[]>([])
  const [loadingWords, setLoadingWords] = useState(true)
  
  // Admin management state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [addingAdmin, setAddingAdmin] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/component/login')
        return
      }

      setCurrentUserEmail(user.email || '')

      // Check if user is admin
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
      
      // Load pending words
      await fetchPendingWords()
      
      // Load admin users if super admin
      if (adminData.is_super_admin) {
        await fetchAdminUsers()
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error checking admin access:', error)
      setLoading(false)
    }
  }

  const fetchPendingWords = async () => {
    setLoadingWords(true)
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pending words:', error)
    } else {
      setPendingWords(data || [])
    }
    setLoadingWords(false)
  }

  const fetchAdminUsers = async () => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admin users:', error)
    } else {
      setAdminUsers(data || [])
    }
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
      showMessage('Mo rejte e efase', 'success')
      await fetchPendingWords()
    }
  }

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) {
      showMessage('Tanpri antre yon adrès imel', 'error')
      return
    }

    setAddingAdmin(true)
    
    // First, get the current user's ID
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('admin_users')
      .insert([{ 
        email: newAdminEmail.trim().toLowerCase(),
        is_super_admin: false,
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
      showMessage('Admin ajoute avèk siksè!', 'success')
      setNewAdminEmail('')
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

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 4000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-lg">Chaje...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Aksè Refize</h1>
          <p className="text-gray-600 mb-6">Ou pa gen pèmisyon pou aksede paj sa a.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            Retounen nan Paj Akèy
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 font-mono">
      <div className="max-w-[1000px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
        
        {/* Header */}
        <div className="mb-4 sm:mb-6 border-2 border-black bg-white p-2 sm:p-3">
          <h1 className="text-sm sm:text-base font-bold mb-1">ADMIN DASHBOARD v1.0</h1>
          <p className="text-xs text-gray-700">
            User: <span className="font-bold">{currentUserEmail}</span>
            {isSuperAdmin && <span className="ml-2 text-xs bg-black text-white px-1 py-0.5">SUPERADMIN</span>}
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-4 p-2 text-xs border-2 ${messageType === 'success' ? 'bg-green-50 text-green-900 border-green-900' : 'bg-red-50 text-red-900 border-red-900'}`}>
            {message}
          </div>
        )}

        {/* Pending Words Section */}
        <div className="mb-4 sm:mb-6">
          <div className="border-2 border-black bg-white p-2 sm:p-3">
            <h2 className="text-xs sm:text-sm font-bold mb-2 border-b border-gray-400 pb-1">
              [ PENDING SUBMISSIONS: {pendingWords.length} ]
            </h2>
            
            {loadingWords ? (
              <p className="text-xs text-gray-600 py-2">Loading...</p>
            ) : pendingWords.length === 0 ? (
              <p className="text-xs text-gray-600 py-4">No pending words.</p>
            ) : (
              <div className="space-y-2">
                {pendingWords.map((word) => (
                  <div key={word.id} className="border border-gray-400 p-2 bg-gray-50">
                    <div className="mb-2">
                      <h3 className="text-xs sm:text-sm font-bold">
                        &gt; {word.word}
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {new Date(word.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </p>
                    </div>

                    <div className="space-y-1.5 mb-2 text-xs">
                      <div>
                        <span className="font-bold">DEF:</span> {word.def}
                      </div>

                      {word.sino && (
                        <div>
                          <span className="font-bold">SYN:</span> {word.sino}
                        </div>
                      )}

                      {word.kont && (
                        <div>
                          <span className="font-bold">ANT:</span> {word.kont}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => approveWord(word.id)}
                        className="flex-1 bg-black text-white hover:bg-gray-700 py-1 text-[10px] sm:text-xs transition-colors border border-black"
                      >
                        [APPROVE]
                      </button>
                      <button
                        onClick={() => rejectWord(word.id)}
                        className="flex-1 bg-white text-black hover:bg-gray-200 py-1 text-[10px] sm:text-xs transition-colors border border-black"
                      >
                        [REJECT]
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Admin Management Section (Super Admin Only) */}
        {isSuperAdmin && (
          <div className="border-2 border-black bg-white p-2 sm:p-3">
            <h2 className="text-xs sm:text-sm font-bold mb-2 border-b border-gray-400 pb-1">
              [ ADMIN MANAGEMENT ]
            </h2>
            
            {/* Add Admin Form */}
            <div className="mb-3 p-2 bg-gray-50 border border-gray-400">
              <h3 className="text-[10px] sm:text-xs font-bold mb-2">ADD NEW ADMIN:</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-400 focus:outline-none focus:border-black text-xs font-mono"
                  disabled={addingAdmin}
                />
                <button
                  onClick={addAdmin}
                  disabled={addingAdmin}
                  className="bg-black text-white hover:bg-gray-700 px-3 py-1 text-[10px] sm:text-xs transition-colors disabled:opacity-50 border border-black whitespace-nowrap"
                >
                  {addingAdmin ? '[ADDING...]' : '[ADD]'}
                </button>
              </div>
            </div>

            {/* Admin Users List */}
            <div>
              <h3 className="text-[10px] sm:text-xs font-bold mb-2">ADMIN LIST ({adminUsers.length}):</h3>
              {adminUsers.length === 0 ? (
                <p className="text-xs text-gray-600 py-3">No admins found.</p>
              ) : (
                <div className="space-y-1.5">
                  {adminUsers.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 border border-gray-400 bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-xs">&gt; {admin.email}</p>
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                          {admin.is_super_admin && (
                            <span className="text-[9px] bg-black text-white px-1 py-0.5">SUPER</span>
                          )}
                          <span className="text-[9px] text-gray-500">
                            {new Date(admin.created_at).toLocaleDateString('en-US')}
                          </span>
                        </div>
                      </div>
                      
                      {!admin.is_super_admin && admin.email !== currentUserEmail && (
                        <button
                          onClick={() => removeAdmin(admin.id, admin.email)}
                          className="bg-white text-black hover:bg-gray-200 px-2 py-1 text-[10px] transition-colors whitespace-nowrap border border-black"
                        >
                          [REMOVE]
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
