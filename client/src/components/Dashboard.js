import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Copy, Edit, Trash2, Calendar, Search, Filter, Tag, Folder } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import API_CONFIG from '../config/api';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchCategories();
      fetchTags();
    }
  }, [user]);

  // Memoized filtered posts calculation
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    return filtered;
  }, [searchTerm, posts, selectedCategory, selectedTag]);

  const fetchPosts = async () => {
    try {
      // Ensure the baseURL and auth header are set correctly
      axios.defaults.baseURL = API_CONFIG.baseURL;
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Don't show error toast for any case - just log it
      // The empty state will be handled by the UI
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Ensure the baseURL and auth header are set correctly
      axios.defaults.baseURL = API_CONFIG.baseURL;
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get('/api/posts/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array on error
    }
  };

  const fetchTags = async () => {
    try {
      // Ensure the baseURL and auth header are set correctly
      axios.defaults.baseURL = API_CONFIG.baseURL;
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get('/api/posts/tags');
      setTags(response.data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setTags([]); // Set empty array on error
    }
  };

  const handleCopy = useCallback(async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  }, []);

  const handleDelete = useCallback(async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`/api/posts/${postId}`);
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Memoized PostCard component
  const PostCard = memo(({ post, onCopy, onDelete, formatDate }) => (
    <div className="card animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {post.title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCopy(post.content)}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Copy content"
          >
            <Copy size={16} />
          </button>
          <Link
            to={`/edit/${post._id}`}
            className="p-1 text-gray-500 hover:text-green-600 transition-colors"
            title="Edit post"
          >
            <Edit size={16} />
          </Link>
          <button
            onClick={() => onDelete(post._id)}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
            title="Delete post"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {post.content}
      </p>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap w-full">
          <span className="badge badge-category flex-shrink-0">
            {post.category}
          </span>
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="badge badge-tag flex-shrink-0"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar size={14} className="mr-1" />
          {formatDate(post.createdAt)}
        </div>
      </div>
    </div>
  ));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Copies</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {posts.length === 0 ? 'No copies yet' : `${posts.length} cop${posts.length === 1 ? 'y' : 'ies'}`}
            </p>
          </div>
          <Link to="/create" className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus size={16} />
            New Copy
          </Link>
        </div>

      {posts.length > 0 && (
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search copies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center gap-2 justify-center"
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filters</span>
              <span className="sm:hidden">Filter</span>
            </button>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label flex items-center gap-2">
                    <Folder size={16} />
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="form-input"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label flex items-center gap-2">
                    <Tag size={16} />
                    Tag
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="form-input"
                  >
                    <option value="">All Tags</option>
                    {tags.map((tag, index) => (
                      <option key={index} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {(selectedCategory !== 'All' || selectedTag) && (
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedTag('');
                    }}
                    className="btn btn-outline text-sm"
                  >
                    Clear Filters
                  </button>
                  <span className="text-sm text-gray-600">
                    {filteredPosts.length} of {posts.length} posts
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No copies yet</h3>
          <p className="text-gray-600 mb-6">Create your first copy to get started</p>
          <Link to="/create" className="btn btn-primary">
            Create Your First Copy
          </Link>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No copies found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPosts.map((post, index) => (
            <PostCard
              key={post._id}
              post={post}
              onCopy={handleCopy}
              onDelete={handleDelete}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 