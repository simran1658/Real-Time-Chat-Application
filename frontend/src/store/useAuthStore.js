import {create} from "zustand";

export const useAuthStore = create((set)=>({
    authUser: null, // Authenticated user
    isSigningup:false, // Signup state 
    isLoggingIn:false, // Login state
    isCheckingAuth: true, // Check if user is authenticated
    isUpdatingProfile:false, // Update profile state
    
}))