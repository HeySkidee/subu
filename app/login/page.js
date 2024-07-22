"use client";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import googleIcon from '../../public/google-icon.png'; // Add your Google icon image to the public folder

const Login = () => {
  const { status } = useSession();

  if (status === "loading") {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-indigo-100 px-4">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Sign In
        </h2>
        <button
          onClick={() => signIn("google", { callbackUrl: "/home" })}
          className="flex items-center justify-center w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Image
            src={googleIcon}
            alt="Google Icon"
            width={24}
            height={24}
            className="mr-2"
          />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
