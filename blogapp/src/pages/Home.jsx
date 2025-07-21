import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogTile from '../components/BlogTile';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import '../css/Home.css';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdComponent';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosPrivate.get('/blog/all');
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

    fetchBlogs();
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
              <Link to={`/blog/${blog._id}`} className="blog-button-home" key={blog._id}>
                <BlogTile blog={blog} />
              </Link>
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
