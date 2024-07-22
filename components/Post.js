import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Post = ({ post, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const { data: session } = useSession();

  const handleLike = async () => {
    await fetch(`/api/posts/${post._id}/like`, { method: 'POST' });
    onUpdate();
  };

  const handleComment = async () => {
    const comment = prompt('Enter your comment:');
    if (comment) {
      await fetch(`/api/posts/${post._id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment }),
      });
      onUpdate();
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedContent }),
      });
      onUpdate();
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="border p-4 rounded">
      <div className="flex items-center mb-2">
        <Link href={`/${post.author.username}`}>
          <Image
            src={post.author.image}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full mr-2"
          />
        </Link>
        <Link href={`/${post.author.username}`}>
          <span className="font-bold">{post.author.name}</span>
        </Link>
      </div>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full p-2 border rounded"
        />
      ) : (
        <p>{post.content}</p>
      )}
      {post.image && (
        <Image src={post.image} alt="Post image" width={500} height={300} className="mt-2" />
      )}
      <div className="mt-2">
        <button onClick={handleLike} className="mr-2 text-blue-500">
          Like ({post.likes.length})
        </button>
        <button onClick={handleComment} className="mr-2 text-green-500">
          Comment ({post.comments.length})
        </button>
        {session && session.user.email === post.author.email && (
          <button onClick={handleEdit} className="text-yellow-500">
            {isEditing ? 'Save' : 'Edit'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;