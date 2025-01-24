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
  const user = useSelector(store => store.user[0])
  const feed = useSelector(store => store?.feed);
  if(!feed) return;
    
  const getFeed = async()=>{
    // if (feed.length > 0) return;
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
    // console.log("Feed is called")
    getFeed()
  },[])

  if(!user) navigator('/')
  // Handle empty feed gracefully
  if (!feed || feed.length === 0) {
    return <div>Loading feed...</div>;
  }

  return (
    <div className='flex justify-center my-10'>
      <UserCard user={feed[0]}/>
    </div>
  )
}

export default Feed