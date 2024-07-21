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
    <div className="p-4">
      <h1 className="text-2xl">Profile</h1>
      <div className="flex items-center space-x-4">
        <img src={session.user.image} alt={session.user.name} className="w-24 h-24 rounded-full" />
        <div>
          <p>Name: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
