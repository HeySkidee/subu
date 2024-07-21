"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/profile"); // Redirect to profile page
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); // Perform sign out action
  };

  return (
    <div className="bg-orange-600 text-black flex justify-between items-center p-3 text-lg">
      {/* Left Side: Home Link */}
      <Link href={"/"} className="px-2 py-1 rounded hover:bg-orange-700">
        Home
      </Link>
      
      {/* Right Side: Join or User Profile */}
      <div className="flex items-center space-x-4">
        {!session ? (
          <Link href={'/login'} className="px-2 py-1 rounded hover:bg-orange-700">
            Join
          </Link>
        ) : (
          <>
            <div className="relative cursor-pointer" onClick={handleProfileClick}>
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <button 
              onClick={handleLogout} 
              className="px-2 py-1 rounded bg-red-700 text-white hover:bg-red-800"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
