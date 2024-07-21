"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Feed from "@/components/Feed";

const ProfilePage = ({ params }) => {
  const { username } = params;
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [username]);

  const fetchUser = async () => {
    const res = await fetch(`/api/users/${username}`);
    const data = await res.json();
    setUser(data);
    setIsFollowing(data.followers.includes(session?.user?.id));
  };

  const handleFollow = async () => {
    await fetch(`/api/users/${username}/follow`, { method: 'POST' });
    setIsFollowing(!isFollowing);
    fetchUser();
  };

  if (status === "loading" || !user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-4">
        <Image
          src={user.image}
          alt={user.name}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">@{user.username}</p>
          <p>{user.bio}</p>
          <p>Followers: {user.followers.length} · Following: {user.following.length}</p>
          {session && session.user.username !== user.username && (
            <button
              onClick={handleFollow}
              className={`mt-2 px-4 py-2 rounded ${
                isFollowing ? 'bg-gray-300' : 'bg-blue-500 text-white'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>
      <Feed userId={user._id} />
    </div>
  );
};

export default ProfilePage;