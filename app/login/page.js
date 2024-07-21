"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Login = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {status === "unauthenticated" && (
        <button onClick={() => signIn("google")} className="bg-blue-600 px-3 py-1 rounded mt-2">Login with Google</button>
      )}
      {status === "authenticated" && (
        <>
          <h1>Hello, {session.user.name}</h1>
          <p>Email: {session.user.email}</p>
          {session.user.image && (
            <Image 
              src={session.user.image} 
              alt={session.user.name} 
              width={50} 
              height={50} 
            />
          )}
          <button onClick={() => signOut()} className="bg-red-700 px-3 py-1 rounded mt-2">Logout</button>
        </>
      )}
    </div>
  );
};

export default Login;
