import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionSlice';

function Connections() {
    const dispatch = useDispatch();
    const connections = useSelector(store => store.connection);
    // console.log(connections);

    const fetchConnections = async () => {
        try {
            const response = await axios(BASE_URL + "/user/connections", {
                withCredentials: true,
            });
            dispatch(addConnections(response.data.data));
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections) return <div className='flex justify-center mt-5 text-lg'>Loading...</div>;
    if (connections.length === 0) return <div className='flex justify-center mt-5 text-lg'>No Connections Found</div>;

    return (
        <div className='flex flex-col gap-5  mt-5 p-5 pb-60 '>
            <h1 className='text-bold text-2xl flex justify-center'>Connections</h1>
            {connections.map((connection, index) => {
                const { firstName, lastName, photoUrl,aboutMe } = connection;
                return (
                    <div key={index}>
                        <div className='flex gap-5 items-center bg-slate-800 p-2 rounded-lg '>
                            <img
                                className='w-36 rounded-full'
                                src={photoUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH0xuC8da1DdVU94AEl9PXOXWnAeRilZEpiw&s"}
                                alt="image"
                            />
                            <div className='flex flex-col'>
                                <h1 className='font-bold text-2xl'>{firstName + " " + lastName}</h1>
                                <p>{aboutMe}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Connections;
