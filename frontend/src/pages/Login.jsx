import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();
  const [errorMessage,setErrorMessage] = useState("");

  const handleLogin = async() => {
    const emailValue = email.current.value;
    const passwordValue = password.current.value;
    console.log('Email:', emailValue);
    console.log('Password:', passwordValue);

    try{
      const response = await axios.post(BASE_URL+"/login",
        {
          email:emailValue,
          password:passwordValue
        },{
          withCredentials:true,
        }
      )
      console.log(response.data[0])
      dispatch(addUser(response.data[0]))
      navigate('/')

    }catch(error){
      // console.log(error.response.data)
      setErrorMessage(error?.response?.data || "Something Went Wrong");
    }

  };

  return (
    <div className="card bg-primary text-primary-content w-96 my-16 ml-[35%]">
      <div className="card-body flex gap-7">
        <label className="input input-bordered flex items-center gap-2 mt-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input 
            type="text" 
            className="grow text-white" 
            placeholder="Email" 
            ref={email}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd" />
          </svg>
          <input 
            type="password" 
            className="grow text-white" 
            placeholder="Password" 
            ref={password}
          />
        </label>
        <label>
          { errorMessage && <p className='text-red-700'>{errorMessage}</p>}
          <button 
            onClick={handleLogin}
            className="btn btn-active btn-accent ml-[12.4rem] px-10">
            Login
          </button>
        </label>
      </div>
    </div>
  );
}

export default Login;
