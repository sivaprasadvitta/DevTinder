import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice';
import store from '../utils/store';
import UserCard from '../components/UserCard'
import { useNavigate } from 'react-router-dom';

function Feed() {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const user = useSelector(store => store.user)
  if(!user) navigator('/')
  const feed = useSelector(store => store?.feed);
  // if(!feed) return;
    
  const getFeed = async()=>{
    try{
      const response = await axios.get(BASE_URL+'/feed',{
        withCredentials:true,
      })
      dispatch(addFeed(response.data));

    }catch(error){
      if (error.response) {
        console.error('Error Response:', error.response.data);
      } else {
        console.error('Error Message:', error.message); // Fallback for undefined response
      }
    }
  }

  useEffect(()=>{
    getFeed()
  },[])

  
  
  // Handle empty feed gracefully
  if (feed.length <= 0) {
    return <div className='flex justify-center mt-5 text-lg'>No New User Found...</div>;
  }

  return (
    <div className='flex justify-center my-10'>
      <UserCard user={feed[0]}/>
    </div>
  )
}

export default Feed