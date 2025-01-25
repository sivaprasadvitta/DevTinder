import axios from 'axios';
import React from 'react'
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';

function UserCard({ user }) {
    const dispatch = useDispatch();

    const handleSendRequest = async (status,_id)=>{
        try{
            const response = await axios.post(BASE_URL+"/request/send/"+status+"/"+_id,
                {},
                {withCredentials:true}
            );
            dispatch(removeUserFromFeed(_id))


        }catch(error){
            console.log(error.message);
        }
    }

    return (
        <div className="card bg-base-300 w-96 shadow-2xl">
            <figure className='w-56 ml-20 mt-5 rounded-lg'>
                <img
                    className='w-full h-full object-cover'
                    alt="User Avatar"
                    src={user.photoUrl ||' https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'} // Fallback for photoUrl
                />
            </figure>
            <div className="card-body flex flex-col gap-3">
                <h2 className="card-title">{user.firstName}</h2>
                <p className='mb-2'>{user.aboutMe}</p>
                <div className='flex justify-between'>
                    <div className="card-actions justify-end">
                        <button
                            onClick={()=> handleSendRequest("ignored",user._id)}
                            className="btn btn-primary w-32"
                        >Ignore</button>
                    </div>
                    <div className="card-actions justify-end">
                        <button 
                            onClick={()=> handleSendRequest("intrested",user._id)}
                            className="btn btn-accent w-32"
                        >Intersted</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCard