"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { navLinks } from '@/constants'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'

const MobileNavbar = () => {
  const pathname = usePathname();

  return (
    <header className='header'>
      <Link href={'/'} className='flex items-center gap-2 md:py-2'>
      <Image 
          src="/assets/images/DA-logo.png"
          alt='logo'
          width={150}
          height={150}
          className=' object-contain'
          />
      </Link>
      <nav className='flex gap-2'>
        <SignedIn>
          <UserButton afterSignOutUrl='/' />

          <Sheet>
            <SheetTrigger>
              <Image 
               src={'/assets/icons/menu.svg'}
               alt='hamicon'
               width={32}
               height={32}
               className=' cursor-pointer'
              />
            </SheetTrigger>
            <SheetContent className='sheet-content sm:w-64'>
              <>

              <Link href="/" className='sidebar-logo'>
              <Image 
          src="/assets/images/DA-logo.png"
          alt='logo'
          width={180}
          height={140}
          className=' object-contain'
          />
        </Link>

<ul className='header-nav_elements'>
                {navLinks.map((link)=>{
                    const isActive = link.route === pathname
                    console.log(link.label)
                    return (
                        <li key={link.route} className={`${isActive && 'gradient-text'} p-18 flex whitespace-nowrap text-dark-700`}>         
                    <Link className='sidebar-link cursor-pointer' href={link.route}>
                    <Image 
                    src={link.icon}
                    alt='icons'
                    width={24}
                    height={24}
                    
                    /> 
                    {link.label} 
                    </Link>
                  </li>  
                )})}
                </ul>
              
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>

        <SignedOut>
            <Button asChild className='button bg-purple-gradient bg-cover'>
                <Link href='/sign-in'>
                  SignIn
                </Link>
            </Button>
          </SignedOut>
      </nav>
    </header>
  )
}

export default MobileNavbar
