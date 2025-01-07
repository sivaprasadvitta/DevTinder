import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import store from '../utils/store';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import {removeUser} from '../utils/userSlice'


function NavBar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetails = useSelector(store => store?.user[0])
    // console.log(userDetails)
    // if (!userDetails || userDetails.length === 0) return null;
    // const {firstName} = userDetails

    const handleLogout = async()=>{
        try{
            await axios.post(BASE_URL+"/logout",{},{
                withCredentials:true,
            })
            dispatch(removeUser())
            navigate('/login')
        }catch(error){
            console.log(error)
        }
    }

    return (
        <div>
            <div className="navbar bg-base-300">
                <div className="flex-1">
                    <Link to={'/'} className="btn btn-ghost text-xl">DevTinder</Link>
                </div>
                <div className="flex-none gap-2">
                    <div className="form-control">
                    </div>
                    {userDetails && <div className="dropdown dropdown-end mx-3">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                                <Link className="justify-between">
                                    {/* {firstName} */}
                                    <span className="badge">New</span>
                                </Link>
                            </li>
                            <li><Link to={'/profile'}>Profile</Link></li>
                            {/* <li><Link to={}>Logout</Link></li> */}
                            <li onClick={handleLogout}><Link>Logout</Link></li>
                        </ul>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default NavBar












// import { useSelector } from "react-redux";


// function NavBar() {
//     const userDetails = useSelector(store => store?.user);
//     if (!userDetails || userDetails.length === 0) return null;

//     const { firstName, lastName, email, photoUrl } = userDetails[0];
//     console.log(email);

//     return (
//         <div className="navbar bg-base-300">
//             <div className="flex-1">
//                 <a className="btn btn-ghost text-xl bg-slate-600 text-white">💻DevTinder</a>
//             </div>
//             <div className="flex-none gap-2">
//                 <div className="dropdown dropdown-end">
//                     <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar mx-5">
//                         <div className="w-10 rounded-full">
//                             <img
//                                 alt="Tailwind CSS Navbar component"
//                                 src={photoUrl}
//                             />
//                         </div>
//                     </div>
//                     <ul
//                         tabIndex={0}
//                         className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
//                     >
//                         <li>
//                             <a className="justify-between">
//                                 {firstName}
//                                 <span className="badge">New</span>
//                             </a>
//                         </li>
//                         <li><a>{email}</a></li>
//                         <li><a>Logout</a></li>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default NavBar
