const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Simple in-memory cache for categories and tags
const cache = {
  categories: new Map(),
  tags: new Map(),
  posts: new Map(),
  clearCache: function(userId = null) {
    if (userId) {
      // Clear only this user's cache
      for (const [key, _] of this.posts) {
        if (key.startsWith(`${userId}:`)) {
          this.posts.delete(key);
        }
      }
      for (const [key, _] of this.categories) {
        if (key === `categories:${userId}`) {
          this.categories.delete(key);
        }
      }
      for (const [key, _] of this.tags) {
        if (key === `tags:${userId}`) {
          this.tags.delete(key);
        }
      }
    } else {
      // Clear all cache
      this.categories.clear();
      this.tags.clear();
      this.posts.clear();
    }
  }
};

// Cache middleware
const cacheMiddleware = (duration = 300000) => { // 5 minutes default
  return (req, res, next) => {
    const key = `${req.user._id}:${req.originalUrl}`;
    const cached = cache.posts.get(key);
    
    if (cached && Date.now() - cached.timestamp < duration) {
      return res.json(cached.data);
    }
    
    res.sendResponse = res.json;
    res.json = (data) => {
      cache.posts.set(key, {
        data,
        timestamp: Date.now()
      });
      res.sendResponse(data);
    };
    
    next();
  };
};

// Get all posts for the authenticated user
router.get('/', auth, cacheMiddleware(60000), async (req, res) => { // Reduced cache time to 1 minute
  try {
    const { category, tag, search } = req.query;
    let query = { user: req.user._id };

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories for the authenticated user
router.get('/categories', auth, async (req, res) => {
  try {
    const cacheKey = `categories:${req.user._id}`;
    const cached = cache.categories.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 600000) { // 10 minutes cache
      return res.json(cached.data);
    }
    
    const categories = await Post.distinct('category', { user: req.user._id });
    const result = categories || [];
    
    cache.categories.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    res.json(result);
  } catch (error) {
    console.error('Get categories error:', error);
    res.json([]); // Return empty array instead of error
  }
});

// Get tags for the authenticated user
router.get('/tags', auth, async (req, res) => {
  try {
    const cacheKey = `tags:${req.user._id}`;
    const cached = cache.tags.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 600000) { // 10 minutes cache
      return res.json(cached.data);
    }
    
    const tags = await Post.distinct('tags', { user: req.user._id });
    const result = tags || [];
    
    cache.tags.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    res.json(result);
  } catch (error) {
    console.error('Get tags error:', error);
    res.json([]); // Return empty array instead of error
  }
});

// Get a single post by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user._id
    }).select('-__v');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new post
router.post('/', [
  auth,
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { title, content, category, tags } = req.body;

    const post = new Post({
      title,
      content,
      category: category || 'General',
      tags: tags || [],
      user: req.user._id
    });

    await post.save();

    // Clear cache for this user
    cache.clearCache(req.user._id);

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a post
router.put('/:id', [
  auth,
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { title, content, category, tags } = req.body;

    const post = await Post.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      {
        title,
        content,
        category: category || 'General',
        tags: tags || []
      },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Clear cache for this user
    cache.clearCache(req.user._id);

    res.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Clear cache for this user
    cache.clearCache(req.user._id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 