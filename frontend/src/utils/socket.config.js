import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

// works in local host only
export const createSocketConnection = ()=>{
    return io(BASE_URL)
}