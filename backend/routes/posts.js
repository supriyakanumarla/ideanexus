const express = require('express');
const router = express.Router();
const Post = require('/home/rguktongole/Desktop/ideanexus/backend/models/post.js'); // Ensure Post model exists

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Fetch all posts sorted by newest first
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts.' });
  }
});

// Create a new post
router.post('/create', async (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newPost = new Post({ title, content, author });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully.', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post.' });
  }
});

// Update a post
router.put('/update/:postId', async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json({ message: 'Post updated successfully.', post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Failed to update post.' });
  }
});

// Delete a post
router.delete('/delete/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json({ message: 'Post deleted successfully.', post: deletedPost });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Failed to delete post.' });
  }
});

module.exports = router;
