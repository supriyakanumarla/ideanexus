import React, { useEffect, useState } from 'react';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/styles/postfeed.css';
import PostCard from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/postcard.js';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from API
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/posts');
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="post-feed-container">
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p>Loading posts...</p>
      )}
    </div>
  );
};

export default PostFeed;
