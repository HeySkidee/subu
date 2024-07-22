import React, { useState, useEffect } from 'react';
import Post from './Post';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post._id} post={post} onUpdate={fetchPosts} />
      ))}
    </div>
  );
};

export default Feed;
