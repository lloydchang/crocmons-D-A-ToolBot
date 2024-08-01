import MobileNavbar from '@/components/shared/MobileNavbar'
import Sidebar from '@/components/shared/Sidebar'
import { EdgeStoreProvider } from '@/lib/edgestore'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='root hide-scrollbar'>
      <Sidebar />
      <MobileNavbar />
      {/* Sidebar */}
      {/* Mobile Navbar */}

      <div className='root-container'>
        <div className='wrapper'>
          <EdgeStoreProvider>
          {children}
          </EdgeStoreProvider>
          </div>
      </div>
     

    </main>
  )
}

export default Layout
