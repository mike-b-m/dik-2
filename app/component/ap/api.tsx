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
      checkAdminStatus()
    }, [])

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

    const links =[
      {name:"Ajoute", href:"/"},
      {name:"Tout Mo", href:"/component/all-words"},
    ]

    // Add admin link if user is admin
    if (isAdmin) {
      links.push({name:"Admin", href:"/component/admin"})
    }

    if (loading) {
      return null
    }

    return(
      <nav className='flex flex-wrap gap-1 sm:gap-2'>
        {links.map((link)=>(
          <Link 
            key={link.href} 
            href={link.href} 
            className={`px-2 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 transition-colors duration-200 text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap
              ${pathname === link.href 
                ? 'bg-black text-white border border-black' 
                : 'text-black border border-gray-300 hover:border-black hover:bg-gray-100'
              }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    )
}
