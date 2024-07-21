// app/profile/page.js

"use client";
import React from "react";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Unauthorized</p>; // Redirect to login or show a message
  }

  return (
    <div className=" mt-24 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={session.user.image}
            alt={session.user.name}
            className="w-24 h-24 rounded-full border-2 border-indigo-500"
          />
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              {session.user.name}
            </h1>
            <p className="text-gray-600 text-lg">{session.user.email}</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">About</h2>
          <p className="text-gray-600">
            write something about yourself. feel free and express your true personality!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
