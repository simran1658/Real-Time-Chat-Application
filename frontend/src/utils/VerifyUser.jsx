import React from 'react';
import{Outlet,Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';


export const VerifyUser = () => {
    const { authUser } = useAuth();
    return authUser? <Outlet></Outlet> : <Navigate to="/login" />;
}