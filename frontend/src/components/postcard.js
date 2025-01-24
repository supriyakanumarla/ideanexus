import React from 'react';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/styles/postcard.css';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <span>Posted by: {post.author}</span>
    </div>
  );
};

export default PostCard;
