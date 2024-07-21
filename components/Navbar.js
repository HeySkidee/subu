import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className="bg-orange-600 text-black flex space-x-7 p-3 justify-center text-lg">
        <Link href={"/"} className="px-2 py-1 rounded hover:bg-orange-700">Home</Link>
        <Link href={'/login'} className="px-2 py-1 rounded hover:bg-orange-700">Login</Link>
    </div>
  )
}

export default Navbar