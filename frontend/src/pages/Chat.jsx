import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket.config';
import { useSelector } from 'react-redux';
import store from '../utils/store'
// import { text } from 'express';

function Chat() {
    const { targetUserId } = useParams();
    const user = useSelector(store => store?.user);
    const userId = user[0]?._id;
    const firstName = user[0]?.firstName;
    const [newMessage,setNewMessage] = useState("");

    

    useEffect(()=>{
        if(!userId) return;
        const socket = createSocketConnection()
        // as soon as page loads the socket connection is made and joinChat event is emitted
        socket.emit("joinChat",{firstName,userId,targetUserId})

        return ()=>{
            socket.disconnect();
        }
    },[userId,targetUserId])

    const handleSendMessage = ()=>{
        const socket = createSocketConnection();
        
        socket.emit("sendMessages",{firstName,userId,targetUserId,text : newMessage })
    }

    return (
        <div className='w-1/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col '>
            <div className=' p-5 border-b border-gray-600'>Chat</div>
            <div className='flex-1 overflow-scroll mx-2'>
                <div className="chat chat-start">
                    <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS chat bubble component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <div className="chat-header">
                        Obi-Wan Kenobi
                        <time className="text-xs opacity-50">12:45</time>
                    </div>
                    <div className="chat-bubble">You were the Chosen One!</div>
                    <div className="chat-footer opacity-50">Delivered</div>
                </div>
                <div className="chat chat-end">
                    <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS chat bubble component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <div className="chat-header">
                        Anakin
                        <time className="text-xs opacity-50">12:46</time>
                    </div>
                    <div className="chat-bubble">I hate you!</div>
                    <div className="chat-footer opacity-50">Seen at 12:46</div>
                </div>
                
            </div>
            <div className='flex gap-5 p-2 border-t border-gray-600'>
                <input
                    onChange={(e)=> setNewMessage(e.target.value)}
                    value={newMessage}
                    className='w-11/12 rounded p-1 hover:border border-gray-400'
                    type="text"
                    placeholder='Type your message here...'
                />
                <button
                    onClick={handleSendMessage}
                    className='bg-blue-600 p-5 py-2 rounded hover:bg-blue-500 hover:text-black'><img src="https://img.icons8.com/material-rounded/24/sent.png" alt="sent" /></button>
            </div>
        </div>
    )
}

export default Chat