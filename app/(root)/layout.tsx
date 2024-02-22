import MobileNavbar from '@/components/shared/MobileNavbar'
import Sidebar from '@/components/shared/Sidebar'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='root'>
      <Sidebar />
      <MobileNavbar />
      {/* Sidebar */}
      {/* Mobile Navbar */}

      <div className='root-container'>
        <div className='wrapper'>{children}</div>
      </div>


    </main>
  )
}

export default Layout
