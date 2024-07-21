import React, { useState, useEffect } from 'react';
import Post from './Post';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post._id} post={post} onUpdate={fetchPosts} />
      ))}
    </div>
  );
};

export default Feed;