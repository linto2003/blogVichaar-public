import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogTile from '../components/BlogTile';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import '../css/Home.css';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdComponent';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosPrivate.get('/blog/all')
        setBlogs(response.data);
      } catch (error) {
        const errorMsg = error?.response?.data?.message;
        if (errorMsg === 'Unauthorized') {
          navigate('/login',{state: {from: location}, replace:true});
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchBookmarks = async () => {
      try {
        const response = await axiosPrivate.get('/info/bookmark');
        setBookmarks(response.data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    }

    fetchBlogs();
    fetchBookmarks();
  }, [navigate]);

  return (
    <>
      <div className="home-container">
        <h1>Recent Blogs</h1>
        {loading ? (
          <p>Loading...</p>
        ) : blogs.length > 0 ? (
          <div className="blog-list">
            {blogs.map((blog) => (
              bookmarks.includes(blog._id) ? (
              <Link to={`/blog/${blog._id}`} className="blog-button-home" key={blog._id}>
                <BlogTile blog={blog} bookmarked={true}/>
              </Link>) : (
              <Link to={`/blog/${blog._id}`} className="blog-button-home" key={blog._id}>
                <BlogTile blog={blog} bookmarked={false} />  
              </Link>
              )
            ))}
          </div>
        ) : (
          <p>No blogs available.</p>
        )}
      
      <AdBanner/>
      </div>
    </>
  );
};

export default Home;
