import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import UserCard from '../components/UserCard';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Feed() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user); // Get user from state
  const feed = useSelector((state) => state?.feed); // Get feed from state

  // Retrieve the token from cookies
  const token = Cookies.get('token');

  // Fetch feed data from the server
  const getFeed = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(response.data));
    } catch (error) {
      console.error('Error fetching feed:', error.response?.data || error.message);
    }
  };

  // Effect to check authentication and fetch feed
  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if no token
      return;
    }

    // Only fetch feed if user exists and is non-empty
    if (user && user.length > 0) {
      getFeed();
    }
  }, [token, navigate, user]);

  // Handle empty or undefined feed
  if (!feed || feed.length === 0) {
    return <div className="flex justify-center mt-5 text-lg">No New User Found...</div>;
  }

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
}

export default Feed;
