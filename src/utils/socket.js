import { Server } from "socket.io";


const initializeServer = (server)=>{
    const io = new Server(server, {
        cors:{
            origin:"http://localhost:5173",
        },
    });
    io.on("connection", (socket) => {
        socket.on("joinChat",({firstName,userId,targetUserId})=>{
            const roomId = [userId,targetUserId].sort().join("_");

            console.log(firstName+" joined room : "+ roomId);

            socket.join(roomId)
        })

        socket.on("sendMessages",({firstName,userId,targetUserId,text })=>{
            const roomId = [userId,targetUserId].sort().join();
            console(firstName+" sends:"+ text)
            io.to(roomId).emit("messageRecived",{firstName,text})
        })

        socket.on("disconnect",()=>{

        })
    });
}

export default initializeServer;