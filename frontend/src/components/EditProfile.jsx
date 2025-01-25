import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import UserCard from './UserCard';
import store from '../utils/store';
import ProfileCard from './ProfileCard';

function EditProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((store) => store?.user[0]);
    // console.log(user)

    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [age, setAge] = useState(user.age);
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
    const [skills, setSkills] = useState(user.skills || "type your skills");
    const [aboutMe, setAboutMe] = useState(user.aboutMe || "About your self");
    const [toast, setToast] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const handleEditProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(
                `${BASE_URL}/profile/edit`,
                { firstName, lastName, age, photoUrl, skills, aboutMe },
                { withCredentials: true }
            );
            console.log(response.data);
            // Dispatch and navigate after successful API call
            dispatch(addUser(response?.data?.data));
            setToast(true);
            setTimeout(()=>{
                setToast(false)
            },2000)
            //   navigate('/');
        } catch (error) {
            setErrorMessage(
                error?.response?.data?.error ||
                error?.message ||
                "Something Went Wrong"
            );
        }
    };


    if (!user || user.length == 0) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="flex my-20 justify-between">
                <div className="card bg-neutral-content text-black w-[35%] ml-40 ">
                    <div className="card-body flex gap-1">
                        <h2 className="text-xl">Edit Profile</h2>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text text-black">FirstName</span>
                            </div>
                            <input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                type="text"
                                className="input input-bordered w-full max-w-xs text-white"
                            />
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text text-black">LastName</span>
                            </div>
                            <input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                type="text"
                                className="input input-bordered w-full max-w-xs text-white"
                            />
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text text-black">PhotoUrl</span>
                            </div>
                            <input
                                value={photoUrl}
                                onChange={(e) => setPhotoUrl(e.target.value)}
                                type="text"
                                className="input input-bordered w-full max-w-xs text-white"
                            />
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text text-black">Skills(seperated by comma)</span>
                            </div>
                            <textarea
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                rows="3"
                                className="textarea textarea-bordered w-full max-w-xs text-white"
                            />
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text text-black">About</span>
                            </div>
                            <textarea
                                value={aboutMe}
                                onChange={(e) => setAboutMe(e.target.value)}
                                rows="3"
                                className="textarea textarea-bordered w-full max-w-xs text-white"
                            />
                        </label>
                        <label className="flex gap-3">
                            {errorMessage && <p className="text-red-700">{errorMessage.message || errorMessage}</p>}
                            <button
                                onClick={handleEditProfile}
                                className="btn btn-active btn-accent ml-[13.4rem] px-7 mt-[1.8rem] hover:bg-gray-700 hover:text-white shadow-black">
                                Submit
                            </button>
                        </label>
                    </div>
                </div>
                <ProfileCard />
            </div>
            {
                toast && (
                    <div className="toast toast-top toast-center">
                        {/* <div className="alert alert-info">
                            <span>New mail arrived.</span>
                        </div> */}
                        <div className="alert alert-success">
                            <span>Data Saved Successfully.</span>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default EditProfile;
