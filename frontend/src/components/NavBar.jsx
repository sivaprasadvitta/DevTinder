import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { removeUser } from '../utils/userSlice';

function NavBar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Fetch user details from Redux store
    const userDetails = useSelector((state) => state.user?.[0]); // Ensure user[0] exists
    // console.log(userDetails.photoUrl)
    // Logout handler
    const handleLogout = async () => {
        try {
            await axios.post(`${BASE_URL}/logout`, {}, {
                withCredentials: true,
            });
            dispatch(removeUser());
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Show a loading state or fallback if userDetails is undefined
    if (!userDetails) {
        return (
            <div className="navbar bg-base-300">
                <div className="flex-1">
                    <Link to="/" className="btn btn-ghost text-xl">DevTinder</Link>
                </div>
                {/* <div className="flex-none gap-2">
                    <Link to="/login" className="btn btn-primary">Login</Link>
                </div> */}
            </div>
        );
    }

    return (
        <div>
            <div className="navbar bg-base-300">
                <div className="flex-1">
                    <Link to="/" className="btn btn-ghost text-xl">DevTinder</Link>
                </div>
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end mx-3">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User Avatar"
                                    src={userDetails.photoUrl || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'} // Fallback for photoUrl
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                                <span className="justify-between">
                                    {userDetails.firstName || 'Guest'}
                                    <span className="badge">New</span>
                                </span>
                            </li>
                            <li><Link to="/profile">Profile</Link></li>
                            <li onClick={handleLogout}><Link to="/login">Logout</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
