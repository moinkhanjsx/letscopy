const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    default: 'General'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Comprehensive indexes for optimal performance
postSchema.index({ user: 1, createdAt: -1 }); // Main user posts query
postSchema.index({ user: 1, category: 1 }); // Category filtering
postSchema.index({ user: 1, tags: 1 }); // Tag filtering
postSchema.index({ title: 'text', content: 'text' }); // Text search
postSchema.index({ category: 1 }); // Category aggregation
postSchema.index({ tags: 1 }); // Tag aggregation
postSchema.index({ createdAt: -1 }); // Global sorting

module.exports = mongoose.model('Post', postSchema); 