import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addRequests, removeRequests } from '../utils/requestSlice';

function RequestsRecived() {
    const dispatch = useDispatch();
    const requests = useSelector((state) => state.requests); // Correctly use useSelector
    console.log("Requests in Component:", requests);

    const handleRequest = async (status, _id) => {
        try {
            const response = await axios.post(BASE_URL + "/request/review/" + status + "/" + _id,
                {}, 
                { withCredentials: true }
            );
            dispatch(removeRequests(_id)); // Dispatch removeRequests
        } catch (error) {
            console.log(error.message);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await axios.get(BASE_URL + "/user/requests/received", { withCredentials: true });
            dispatch(addRequests(response.data.result)); // Dispatch addRequests
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (!requests) return <span className="loading loading-bars loading-lg"></span>
    if (requests.length === 0) return <div className='flex justify-center mt-5 text-lg'>No Requests Found...</div>;

    return (
        <div className="flex flex-col gap-5 mt-5 p-5 pb-60">
            <h1 className="text-bold text-2xl flex justify-center">Requests Received</h1>
            {requests.map((request) => {
                const { _id, firstName, lastName, photoUrl, aboutMe } = request.fromUserId;
                return (
                    <div key={_id} className="flex gap-5 justify-around items-center bg-slate-800 p-2 rounded-lg">
                        <img
                            className="w-36 rounded-full"
                            src={photoUrl || "https://via.placeholder.com/150"}
                            alt="User"
                        />
                        <div className="flex flex-col">
                            <h1 className="font-bold text-2xl">{firstName + " " + lastName}</h1>
                            <p>{aboutMe}</p>
                        </div>
                        <div className="flex gap-6">
                            <button
                                className="btn btn-secondary w-24"
                                onClick={() => handleRequest("rejected", _id)}
                            >Reject</button>
                            <button
                                className="btn btn-accent w-24"
                                onClick={() => handleRequest("accepted", _id)}
                            >Accept</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default RequestsRecived;
