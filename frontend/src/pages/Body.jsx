import React, { useEffect, useCallback } from 'react';
import NavBar from '../components/NavBar';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';

function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    if (userData) return; // Avoid fetching if userData already exists
    try {
      const response = await axios.get(`${BASE_URL}/profile`, {
        withCredentials: true,
      });
      dispatch(addUser(response.data)); // Add user data to Redux store
    } catch (error) {
      if (error?.status === 401) {
        navigate('/login'); // Redirect to login if unauthorized
      } else {
        console.error('Error fetching profile:', error.message);
      }
    }
  }, [userData, dispatch, navigate]);

  useEffect(() => {
    fetchProfile(); // Call fetchProfile on component mount
  }, [fetchProfile]);

  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Body;
