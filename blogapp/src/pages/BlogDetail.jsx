import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from '../api/axios';
import '../css/BlogDetail.css';
import '../css/BlogTile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '../components/IconButton';
import { faHeart, faEye} from '@fortawesome/free-solid-svg-icons';
import AdBanner from '../components/AdComponent';


const BlogDetail = () => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [blog, setBlog] = useState(null);
  const [like, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [views, setViews] = useState(0);
  const [error, setError] = useState(null);

  const toggleLike = async () => {
    try {
      const res = await axiosPrivate.patch(`/blog/${blog._id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likesCount);
    } catch (err) {
      console.error('Error liking blog:', err);

      if (err?.response?.status === 401 || err?.response?.status === 403) {
        navigate('/login', { state: { from: location }, replace: true });
      }
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogRes= await axios.get(`/blog/${id}`);
        const viewsRes = await axiosPrivate.patch(`/blog/${id}/views`);
        try {
          const likeRes = await axiosPrivate.get(`/blog/${id}/like`);
          const liked = likeRes.data.liked;
          setLiked(liked);
        } catch (likeError) {
          setLiked(false);
        }
  
        const blog = blogRes.data.blog;
        const viewCount = viewsRes.data.viewCount;
        setBlog(blog);
        
        setLikeCount(blog.likes.length);
        setViews(viewCount);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Blog not found or failed to load.');
        navigate('/');
      }
    };

    fetchBlog();
  }, [id, axiosPrivate, navigate]);

  if (error) {
    return <div className="blog-detail-container">{error}</div>;
  }

  if (!blog) {
    return <div className="blog-detail-container">Loading blog...</div>;
  }

  return (
    <div className="blog-detail-container">
      <img className="avatar" src={blog.imageUrl} alt="blog banner" />
      <h1>{blog.title}</h1>
      <p className="author">by {blog.author?.username}</p>
      <img
        className="author-avatar"
        src={blog.author?.avatarUrl || '/default-avatar.png'}
        alt="Author Avatar"
      />

      <div className="interaction-section">
        <IconButton
          icon={faHeart}
          state={like}
          onColor="red"
          offColor="gray"
          fontSize="1.5rem"
          toggleFunction={toggleLike}
          ariaLabel="Like this post"
        />
        <span>{likeCount}</span>
        <FontAwesomeIcon icon={faEye} />
        <span>{views}</span>
      </div>


    <div className="content">{blog.content}</div>

    <AdBanner/>
    </div>
  );
};

export default BlogDetail;
