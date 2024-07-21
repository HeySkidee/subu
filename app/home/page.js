// app/home/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
    } else {
      fetchPosts();
    }
  }, [status, router]);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting post:', newPost);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newPost }),
    });
    if (res.ok) {
      console.log('Post submitted successfully');
      setNewPost("");
      fetchPosts();
    } else {
      console.error('Error submitting post:', await res.text());
    }
  };

  const handleLike = async (postId) => {
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (res.ok) {
      fetchPosts();
    }
  };

  const handleComment = async (postId, comment) => {
    const res = await fetch(`/api/posts/${postId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment }),
    });
    if (res.ok) {
      fetchPosts();
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's happening?"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">
          Post
        </button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded">
            <div className="flex items-center mb-2">
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full mr-2"
              />
              <span className="font-bold">{post.author.name}</span>
            </div>
            <p>{post.content}</p>
            <div className="mt-2">
              <button onClick={() => handleLike(post._id)} className="mr-2 text-blue-500">
                Like ({post.likes.length})
              </button>
              <button onClick={() => handleComment(post._id, prompt("Enter your comment:"))} className="text-green-500">
                Comment ({post.comments.length})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;