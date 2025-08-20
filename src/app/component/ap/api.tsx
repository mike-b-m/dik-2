'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Handler() {
    const pathname = usePathname()
    const links =[
      {name:"Ajoute", href:"/"},
      {name:"Modifie", href:"/modifie"},
    ]
    return(
      <nav className='flex m-2'>
        {links.map((link)=>(
          <Link key={link.href} href={link.href} className={`px-3 py-1 rounded 
            ${pathname === link.href ? 'bg-clo text' : 'text-gray-700  hover:bg-gray-200'}`}>
              {link.name}
            </Link>
        ))}
        
      </nav>
    )
}
