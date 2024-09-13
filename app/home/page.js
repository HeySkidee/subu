// app/home/page.js
"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Feed from "@/components/Feed";

const HomePage = () => {
	//oh maigotto its salmon kun
  const { data: session, status } = useSession();
  const router = useRouter();
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", newPost);
    if (image) {
      formData.append("image", image);
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setNewPost("");
      setImage(null);
      // Trigger feed update
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-4 bg-white rounded shadow-md">
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share any kind of progress you made recently..."
            className="w-full p-2 border rounded mb-2"
          />
          <div className="flex items-center mb-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-white text-black px-4 py-2 rounded border border-stone-300 hover:bg-indigo-600 hover:text-white transition-colors mr-2"
            >
              Choose File
            </label>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="submit"
              className="ml-auto bg-indigo-600 text-white px-8 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              Post
            </button>
          </div>
        </form>
        <Feed />
      </div>
    </div>
  );
};

export default HomePage;
