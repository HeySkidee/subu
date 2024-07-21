// components/Feed.js
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get('/api/posts');
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post._id} className="border p-4 rounded">
          <div className="flex items-center space-x-4">
            <img src={post.author.image} alt={post.author.name} className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-bold">{post.author.name}</p>
              <p>{post.title}</p>
              <p>{post.content}</p>
            </div>
          </div>
          <div className="mt-2">
            <button className="mr-2" onClick={() => likePost(post._id)}>Like</button>
            <button onClick={() => addComment(post._id)}>Comment</button>
          </div>
          <div className="mt-2">
            {post.comments.map((comment, index) => (
              <div key={index} className="border-t pt-2 mt-2">
                <div className="flex items-center space-x-4">
                  <img src={comment.author.image} alt={comment.author.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-bold">{comment.author.name}</p>
                    <p>{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
