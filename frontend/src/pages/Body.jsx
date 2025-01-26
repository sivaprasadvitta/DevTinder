import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'
import store from '../utils/store'
import Login from './Login'


function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(store => store.user)
  // console.log(userData)

  const fetchProfile = async()=>{
    // console.log("Body")
    if(userData) return;
    try{
      
      const response = await axios.get(BASE_URL+"/profile",{
        withCredentials:true
      })
      dispatch(addUser(response.data))

    }catch(error){
      // console.log(error.status)
      if( error.status === 401){
        navigate('/login')
      }
      // console.log(error.message)
    }
  }

  useEffect(()=>{
    fetchProfile()
    if(userData.length == 0){
      navigate('/login')
    }
  },[userData.length,navigate])

  return (
    <div>
      <NavBar/>
      {userData.length !=0 ? <Outlet/>:<Login/>}
      <Footer/>
    </div>
  )
}

export default Body