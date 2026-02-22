import {createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from 'react-hot-toast'
import {io} from 'socket.io-client'

const backenUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backenUrl;

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token , setToken] = useState(localStorage.getItem("token"));
    const [authUser , setAuthUser] = useState(null);
    const [onlineUsers , setOnlineUsers] = useState([]);
    const [socket , setSocket] = useState(null);

    // cheak if user is authnetickted and if so  , set the user data and connect the socket

    const ckeckAuth = async () => {
        try {
            const {data} = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //logout function to handle user logout and socket dosconnection
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setOnlineUsers([]);
        setAuthUser(null);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logout successfuly");
        socket.disconnect();
    }

    // update profile function to handle user profile updates
     const updateProfile = async (body) => {
        try {
            const {data} = await axios.put("/api/auth/update-profile" , body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("profile updated successfuly");
            }
        } catch (error) {
            toast.error(error.message);
        }
     }   

    // login function to handle user authentication and socket connection
    const login = async (state , credentials)=> {
        try {
            const {data} = await axios.post(`/api/auth/${state}` , credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token" , data.token);
                toast.success(data.msg);
                return true;
            }else{
                toast.error(data.msg);
                return false;
            }
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    }


    // Connect socket function to handle socket connection and online user updates
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return ; 
        const newSocket = io(backenUrl , {
            query: {
                userId : userData._id,
            }
        })
        newSocket.connect();
        setSocket(newSocket);
        newSocket.on("getOnlineUsers" , (userIds) => {
            setOnlineUsers(userIds)
        })
    }

    useEffect(()=> {
        if(token){
            axios.defaults.headers.common["token"]=token;
            ckeckAuth();
        } else {
            setAuthUser(null);
        }
    },[token])
    const value = {
        axios ,
        authUser ,
        onlineUsers ,
        socket ,
        login ,
        logout ,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}