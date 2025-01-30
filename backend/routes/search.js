const express = require('express');
const router = express.Router();
const auth = require('/home/rguktongole/Desktop/ideanexus/backend/middlewear/authmiddleware.js');
const Project = require('/home/rguktongole/Desktop/ideanexus/backend/models/Project.js');
const User = require('/home/rguktongole/Desktop/ideanexus/backend/models/user.js');
const Bookmark = require('/home/rguktongole/Desktop/ideanexus/backend/models/Bookmark.js');
const Follow = require('/home/rguktongole/Desktop/ideanexus/backend/models/Follow.js');

// Search endpoint
router.get('/api/search', auth, async (req, res) => {
  try {
    const {
      type,
      query,
      category,
      tags,
      collaborationStatus,
      skills,
      experience,
      sortBy
    } = req.query;

    let results;
    if (type === 'projects') {
      // Build project search query
      const searchQuery = {};
      
      // Add text search if query exists
      if (query) {
        searchQuery.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } }
        ];
      }

      // Add filters
      if (category) searchQuery.category = category;
      if (collaborationStatus && collaborationStatus !== 'all') {
        searchQuery.status = collaborationStatus;
      }
      if (tags && Array.isArray(tags) && tags.length > 0) {
        searchQuery.tags = { $in: tags };
      }

      // Get sort configuration
      const sortConfig = getSortConfig(sortBy);

      // Fetch projects with bookmark status
      results = await Project.aggregate([
        { $match: searchQuery },
        { $sort: sortConfig },
        {
          $lookup: {
            from: 'bookmarks',
            let: { projectId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$itemId', '$$projectId'] },
                      { $eq: ['$userId', req.user._id] },
                      { $eq: ['$itemType', 'projects'] }
                    ]
                  }
                }
              }
            ],
            as: 'bookmarks'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator'
          }
        },
        {
          $addFields: {
            isSaved: { $gt: [{ $size: '$bookmarks' }, 0] },
            creator: { $arrayElemAt: ['$creator', 0] }
          }
        },
        {
          $project: {
            bookmarks: 0,
            'creator.password': 0,
            'creator.email': 0
          }
        }
      ]);

    } else if (type === 'users') {
      // Build user search query
      const searchQuery = {
        _id: { $ne: req.user._id } // Exclude current user
      };

      // Add text search if query exists
      if (query) {
        searchQuery.$or = [
          { username: { $regex: query, $options: 'i' } },
          { bio: { $regex: query, $options: 'i' } },
          { skills: { $regex: query, $options: 'i' } }
        ];
      }

      // Add filters
      if (skills && Array.isArray(skills) && skills.length > 0) {
        searchQuery.skills = { $in: skills };
      }
      if (experience && experience !== 'all') {
        searchQuery.experience = experience;
      }

      // Fetch users with following status
      results = await User.aggregate([
        { $match: searchQuery },
        {
          $lookup: {
            from: 'follows',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$followedId', '$$userId'] },
                      { $eq: ['$followerId', req.user._id] }
                    ]
                  }
                }
              }
            ],
            as: 'follows'
          }
        },
        {
          $addFields: {
            isFollowing: { $gt: [{ $size: '$follows' }, 0] },
            followerCount: { $size: '$follows' }
          }
        },
        {
          $project: {
            password: 0,
            email: 0,
            follows: 0
          }
        }
      ]);
    }

    res.json({ results });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Recommendations endpoint
router.get('/api/recommendations/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.user._id;

    let recommendations;
    if (type === 'projects') {
      // Get user's interests and previous interactions
      const userInterests = await getUserInterests(userId);
      
      // Find matching projects
      recommendations = await Project.aggregate([
        {
          $match: {
            $or: [
              { tags: { $in: userInterests.tags } },
              { category: { $in: userInterests.categories } }
            ],
            status: 'open',
            creator: { $ne: userId }
          }
        },
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'bookmarks',
            let: { projectId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$itemId', '$$projectId'] },
                      { $eq: ['$userId', userId] },
                      { $eq: ['$itemType', 'projects'] }
                    ]
                  }
                }
              }
            ],
            as: 'bookmarks'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator'
          }
        },
        {
          $addFields: {
            isSaved: { $gt: [{ $size: '$bookmarks' }, 0] },
            creator: { $arrayElemAt: ['$creator', 0] }
          }
        },
        {
          $project: {
            bookmarks: 0,
            'creator.password': 0,
            'creator.email': 0
          }
        }
      ]);

    } else if (type === 'users') {
      // Get user's network and similar interests
      const userNetwork = await getUserNetwork(userId);
      
      // Find similar users
      recommendations = await User.aggregate([
        {
          $match: {
            _id: { $ne: userId },
            _id: { $nin: userNetwork.following },
            skills: { $in: userNetwork.skills }
          }
        },
        { $sort: { followerCount: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'follows',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$followedId', '$$userId'] },
                      { $eq: ['$followerId', userId] }
                    ]
                  }
                }
              }
            ],
            as: 'follows'
          }
        },
        {
          $addFields: {
            isFollowing: { $gt: [{ $size: '$follows' }, 0] },
            followerCount: { $size: '$follows' }
          }
        },
        {
          $project: {
            password: 0,
            email: 0,
            follows: 0
          }
        }
      ]);
    }

    res.json({ recommendations });
  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bookmark endpoints
router.post('/api/bookmarks', auth, async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const userId = req.user._id;

    // Validate itemType
    if (!['projects', 'users'].includes(itemType)) {
      return res.status(400).json({ message: 'Invalid item type' });
    }

    // Check if item exists
    const Item = itemType === 'projects' ? Project : User;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const existingBookmark = await Bookmark.findOne({ 
      userId, 
      itemId,
      itemType 
    });

    if (existingBookmark) {
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      res.json({ message: 'Item removed from bookmarks' });
    } else {
      await Bookmark.create({ userId, itemId, itemType });
      res.json({ message: 'Item bookmarked successfully' });
    }
  } catch (err) {
    console.error('Bookmark error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow/Unfollow endpoint
router.post('/api/users/:userId/follow', auth, async (req, res) => {
  try {
    const followerId = req.user._id;
    const followedId = req.params.userId;

    // Prevent self-following
    if (followerId.toString() === followedId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    // Check if user to follow exists
    const userToFollow = await User.findById(followedId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({ followerId, followedId });

    if (existingFollow) {
      await Follow.deleteOne({ _id: existingFollow._id });
      res.json({ message: 'User unfollowed successfully' });
    } else {
      await Follow.create({ followerId, followedId });
      res.json({ message: 'User followed successfully' });
    }
  } catch (err) {
    console.error('Follow error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper functions
const getSortConfig = (sortBy) => {
  switch (sortBy) {
    case 'recent':
      return { createdAt: -1 };
    case 'popular':
      return { views: -1, likes: -1 };
    default: // relevance
      return { score: { $meta: 'textScore' } };
  }
};

const getUserInterests = async (userId) => {
  try {
    // Get user's interests based on their profile, bookmarks, and activity
    const user = await User.findById(userId);
    const bookmarks = await Bookmark.find({ 
      userId, 
      itemType: 'projects' 
    });
    
    const bookmarkedProjects = await Project.find({
      _id: { $in: bookmarks.map(b => b.itemId) }
    });

    // Collect tags and categories from bookmarked projects
    const tags = new Set();
    const categories = new Set();

    bookmarkedProjects.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
      if (project.category) categories.add(project.category);
    });

    // Add user's own skills as interests
    if (user.skills) {
      user.skills.forEach(skill => tags.add(skill));
    }

    return {
      tags: Array.from(tags),
      categories: Array.from(categories)
    };
  } catch (err) {
    console.error('Error getting user interests:', err);
    return { tags: [], categories: [] };
  }
};

const getUserNetwork = async (userId) => {
  try {
    // Get user's network information
    const user = await User.findById(userId);
    const following = await Follow.find({ followerId: userId })
      .distinct('followedId');

    return {
      following,
      skills: user.skills || []
    };
  } catch (err) {
    console.error('Error getting user network:', err);
    return { following: [], skills: [] };
  }
};

module.exports = router; 