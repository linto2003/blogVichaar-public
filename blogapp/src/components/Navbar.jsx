// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import '../css/Navbar.css';
import useLogout from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useAuth();

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
      <div className="nav-links">
         {/* <input
          className='search-input'
          type="text"
          placeholder="Search blogs..."
          id="search-input"
          
        /> */}
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
