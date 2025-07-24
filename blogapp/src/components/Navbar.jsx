import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../css/Navbar.css';
import useLogout from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/srch?q=${encodeURIComponent(searchTerm.trim())}`);
    }else {
      navigate('/');
      alert('Please enter a search term.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (

    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="logo">BlogVichar</h2>
      </div>
      <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
      <div className="nav-links">

        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/write">Write</Link>
        
        {!auth?.accessToken ? (
          <button onClick={handleLogin} className="link-button">
            Login
          </button>
        ) : (
          <>
          <Link to="/my-blogs">My Blogs</Link>
          <button onClick={handleLogout} className="link-button logout">
            Logout
          </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
