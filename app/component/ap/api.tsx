'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../db';

export default function Handler() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', user.email)
            .single()
          setIsAdmin(!!adminData)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
      }
      setLoading(false)
    }
    checkAdminStatus()
  }, [])

  const links = [
    { name: "Ajoute", href: "/" },
    { name: "Tout Mo", href: "/component/all-words" },
  ]

  if (isAdmin) {
    links.push({ name: "Admin", href: "/component/admin" })
  }

  if (loading) {
    return null
  }

  return (
    <nav className='flex flex-wrap gap-1 sm:gap-1.5'>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-3 sm:px-4 py-1.5 rounded-full transition-colors text-xs sm:text-sm whitespace-nowrap ${
            pathname === link.href
              ? 'bg-blueht text-white'
              : 'text-ink-soft hover:text-blueht hover:bg-blueht-soft'
          }`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  )
}
