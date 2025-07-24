import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import BlogTile from '../components/BlogTile';
import '../css/Home.css';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import AdBanner from '../components/AdComponent';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [blogs, setResults] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      try {
        const res = await axios.get(`blog/search?q=${query}`);
        setResults(res.data);
      } catch (error) {
        console.error("Search error:", error);
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
    };

    fetchResults();
    fetchBookmarks();
  }, [query, axiosPrivate]);

 
  return (
    <>
      <div className="home-container">
        <h1>Your Search Results</h1>
        {loading ? (
          <p>Searching...</p>
        ) : blogs.length > 0 ? (
          <div className="blog-list">
            {blogs.map((blog) => (
              <Link to={`/blog/${blog._id}`} className="blog-button-home" key={blog._id}>
                <BlogTile blog={blog} bookmarked={bookmarks.includes(blog._id)} />
              </Link>
            ))}
            <AdBanner />
          </div>
        ) : (
          <p>No blogs available.</p>
        )}
      </div>
    </>
  );
};

export default SearchResults;