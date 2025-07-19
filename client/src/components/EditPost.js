import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Tag, Folder } from 'lucide-react';

const EditPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/posts/${id}`);
      const { title, content, category, tags } = response.data;
      setFormData({ title, content, category: category || 'General', tags: tags || [] });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length > 10000) {
      newErrors.content = 'Content must be less than 10000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    try {
      await axios.put(`/api/posts/${id}`, formData);
      toast.success('Post updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating post:', error);
      const message = error.response?.data?.message || 'Failed to update post';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleCancel}
          className="btn btn-outline flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>

      <div className="card animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Edit Copy</h1>
          <p className="text-gray-600 text-sm sm:text-base">Update your copy content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter post title"
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {formData.title.length}/100 characters
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label flex items-center gap-2">
              <Folder size={16} />
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Ideas">Ideas</option>
              <option value="Notes">Notes</option>
              <option value="Projects">Projects</option>
              <option value="Learning">Learning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label flex items-center gap-2">
              <Tag size={16} />
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input flex-1"
                placeholder="Add a tag and press Enter"
                maxLength={30}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn btn-outline"
                disabled={!tagInput.trim()}
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge badge-tag flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-700 hover:text-blue-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`form-textarea ${errors.content ? 'border-red-500' : ''}`}
              placeholder="Write your post content here..."
              rows={12}
              maxLength={10000}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {formData.content.length}/10000 characters
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex items-center gap-2 justify-center"
            >
              {saving ? (
                <div className="spinner"></div>
              ) : (
                <Save size={16} />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline justify-center"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost; 