"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from 'next/link';

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              subu
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {status === 'authenticated' ? (
              <>
                <Link href={`/profile`}>
                  <Image
                    src={session.user.image}
                    alt={session.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Join
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
