'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      alert('You must be logged in to create a post.');
      return;
    }

    const newPost = {
      title,
      content,
      author: {
        name: session.user.name,
        image: session.user.image,
      },
    };

    try {
      await axios.post('/api/posts', newPost);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Post
      </button>
    </form>
  );
};

export default CreatePost;
