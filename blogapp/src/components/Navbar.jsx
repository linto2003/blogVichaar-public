import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../css/Navbar.css';
import useLogout from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faSearch } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/srch?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
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

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}> 
        <FontAwesomeIcon icon={faEllipsisVertical}/>
      </button>
      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>

        <Link to="/" onClick={() =>setMenuOpen(!menuOpen)}>Home</Link>
        <Link to="/profile" onClick={() =>setMenuOpen(!menuOpen)}>Profile</Link>
        <Link to="/write" onClick={() =>setMenuOpen(!menuOpen)}>Write</Link>
        
        {!auth?.accessToken ? (
          <button onClick={handleLogin} className="link-button">
            Login
          </button>
        ) : (
          <>
          <Link to="/my-blogs" onClick={() =>setMenuOpen(!menuOpen)} >My Blogs</Link>
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
