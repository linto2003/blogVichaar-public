import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import '../css/UserProfile.css';
import Navbar from '../components/Navbar';


const UserProfile = () => {
  const [user, setUser] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosPrivate.get('/info/profile');
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        navigate('/login',{state: {from: location}, replace:true});
        
      }
    };

    fetchProfile();
  }, [axiosPrivate, navigate]);

  if (!user) return <p>Loading profile...</p>;

  return (
    <>
    <div className="profile-container">
      <h2>User Profile</h2>
      <img src={user.avatarUrl} alt="Avatar" className="profile-avatar" />
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      <p><strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}</p>
    </div>
    
    </>
    
  );
};

export default UserProfile;
