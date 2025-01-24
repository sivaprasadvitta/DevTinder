import React from 'react';
import { useSelector } from 'react-redux';

function ProfileCard() {
    const user = useSelector(store => store.user[0]);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="card bg-base-300 w-96 shadow-2xl">
            <figure className='w-56 ml-20 mt-5 rounded-lg'>
                <img
                    className='w-full h-full object-cover'
                    alt="User Avatar"
                    src={user.photoUrl || 'https://via.placeholder.com/150'} // Fallback for photoUrl
                />
            </figure>
            <div className="flex flex-col p-6 gap-5">
                <h2 className="flex justify-center text-2xl font-bold">
                    {user.firstName} {user.lastName || ''}
                </h2>
                <div>
                    <h1 className='text-lg font-bold'>About</h1>
                    <p className='ml-3'>{user.aboutMe || "No about info available"}</p>
                </div>
                <div>
                    <h1 className='text-lg font-bold'>Skills</h1>
                    <ul>
                        {user.skills?.split(',').map((skill, index) => (
                            <li key={index} className='ml-3' >{skill.trim()}</li>
                        )) || <li>No skills available</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;
