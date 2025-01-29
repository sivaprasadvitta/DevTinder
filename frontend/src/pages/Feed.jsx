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
  const user = useSelector((state) => state?.user); 
  const feed = useSelector((state) => state?.feed); 

  // Retrieve token once
  const token = Cookies.get('token');

  const getFeed = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/feed`, { withCredentials: true });
      dispatch(addFeed(response.data));
    } catch (error) {
      console.error('Error fetching feed:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
  
    if (user?.length > 0 && feed?.length === 0) {
      getFeed();
    }
  }, [token, feed?.length]);  // ✅ Depend only on `token` & `feed.length`
  

  if (!feed || feed?.length === 0) {
    return <div className="flex justify-center mt-5 text-lg">No New User Found...</div>;
  }

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
}

export default Feed;
