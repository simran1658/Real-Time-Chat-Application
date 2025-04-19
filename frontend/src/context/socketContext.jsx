import { createConnection } from "mongoose";
import io from "socket.io-client";
import { createContext, useContext, useEffect,useState } from "react";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuth();

    useEffect(() => {
        if (authUser) {
            const socket = io("https://shareus-chatapp.onrender.com/", {
                query: {
                    userId: authUser?._id,
                }
            })
            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });
            setSocket(socket);
            return () => {
                socket.close();
            }
        }
        else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);
    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    )

}