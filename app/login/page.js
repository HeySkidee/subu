"use client";
import React from "react";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const { status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center mt-44">
      <button 
        onClick={() => signIn("google", { callbackUrl: "/home" })}
        className="bg-blue-600 px-3 py-1 rounded mt-2 text-white"
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
