import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx';
import { Sidebar } from '../Home/Sidebar.jsx';
import MessageContainer from '../Home/MessageContainer.jsx';
import userConversation from '../zustand/useConversations.js';

export const HomePage = () => {
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [selectedUser , setSelectedUser] = useState(null);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setSidebarVisible(false);
    };

    const handleShowSidebar = () => {
        setSidebarVisible(true);
        setSelectedUser(null);
    };
    return (
        <div className='flex justify-between min-w-full md:min-w-[550px] md:max-w-[65%] px-2 h-[95%] md:h-full rounded-xl shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
            
            {/* Sidebar */}
            <div className={`w-full py-2 md:flex ${isSidebarVisible ? '' : 'hidden'}`}>
                <Sidebar onSelectUser={handleUserSelect} />
            </div>

            {/* Divider for the selected conversation */}
            <div className={`divider divider-horizontal px-3 md:flex ${isSidebarVisible ? '' : 'hidden'} ${selectedUser ? 'block' : 'hidden'}`}> </div>

            {/* Message Container */}
            <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'} bg-white-200 `}>
                <MessageContainer onBackUser={handleShowSidebar} />
            </div>
        </div>
    );
}

export default HomePage;
