import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import { BiLogOut } from 'react-icons/bi';
import userConversation from '../zustand/useConversations';
import { useSocketContext } from '../context/socketContext';


export const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageUsers, setnewMessageUsers] = useState('');
  const { messages, setMessage, SelectedConversation, setSelectedConversation } = userConversation();
  const { onlineUsers, socket } = useSocketContext();

  //chats function 

  const nowOnline = chatUser.map((user) => (user._id));
  const isOnline = nowOnline.map(userId => onlineUsers.includes(userId));


  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setnewMessageUsers(newMessage)
    })
    return () => socket?.off("newMessage");
  }, [socket, messages])

  useEffect(() => {
    const chatUserhandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get(`/api/user/currentchatters`);
        const data = chatters.data;

        // Since backend returns an array directly, no need to check data.success
        console.log("Chatters from backend:", data); // Confirm it's an array

        if (data.success === false) {
          setLoading(false)
          console.log(data.message);
        }
        setLoading(false);
        setChatUser(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUserhandler();
  }, [])


  console.log(chatUser);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      if (data.length === 0) {
        toast.info("User Not Found");
      }
      else {
        setSearchUser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);

    }
  }

  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setnewMessageUsers('');
  }

  const handleSearchback = () => {
    setSearchUser([]);
    setSearchInput('');
  }

  const handleLogOut = async () => {
    setLoading(true);
    try {
      const logout = await axios.post('/api/auth/logout');
      const data = logout.data;
      if (data?.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      toast.info(data.message);
      localStorage.removeItem('shareus')
      setAuthUser(null);
      setLoading(false);
      navigate('/login');
    }
    catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  console.log(searchUser);
  // console.log("Profile pic:", authUser?.profilepic);

  return (
    <div className='h-full w-auto px-1'>
      <div className='flex justify-between gap-2'>
        <form onSubmit={handleSearchSubmit} className='w-auto flex items-center justify-between bg-white rounded-full'>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className='px-4 w-auto bg-transparent outline-none rounded-full'
            placeholder='Search User'
          />
          <button className='btn btn-circle bg-sky-700 hover:bg-gray-950'>
            <FaSearch />
          </button>
        </form>
        <img onClick={() => navigate(`/profile/${authUser._id}`)} src={authUser?.profilePic}
          className='self-center h-12 w-12 hover:scale-110 cursor-pointer' />
      </div>
      <div className='divider px-3'></div>
      {searchUser?.length > 0 ? (
        <>
          <div className='min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar'>
            <div className='w-auto'>
              {searchUser.map((user, index) => (
                <div key={user._id}>
                  <div
                    onClick={() => handleUserClick(user)}
                    className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user?._id ? 'bg-sky-500' : ''}`}>

                    <div className='relative'>
                      <div className='avatar'>
                        <div className='w-12 rounded-full'>
                          <img src={user.profilePic} alt="user.img" />
                        </div>
                      </div>
                      {isOnline[index] && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>



                    <div className='flex flex-col flex-1'>
                      <p className='font-bold text-gray-950'>{user.username}</p>
                    </div>

                  </div>
                  <div className='divider divide-solid px-3 h-[1-px]'></div>
                </div>
              )
              )}
            </div>
          </div>
          <div className='mt-auto px-1 py-1 flex'>
            <button onClick={handleSearchback} className='bg-white rounded-full px-2 py-1 self-center'>
              <IoArrowBackSharp size={25} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className='min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar'>
            <div className='w-auto'>
              {chatUser.length === 0 ? (
                <>
                  <div className='font-bold items-center flex flex-col text-xl text-white-500'>
                    <h1>No Chats</h1>
                  </div>
                </>
              ) : (
                <>
                  {chatUser.map((user, index) => (
                    <div key={user._id}>
                      <div
                        onClick={() => handleUserClick(user)}
                        className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user?._id ? 'bg-sky-500' : ''}`}>

                        <div className='relative'>
                          <div className='avatar'>
                            <div className='w-12 rounded-full'>
                              <img src={user.profilePic} alt="user.img" />
                            </div>
                          </div>
                          {isOnline[index] && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>



                        <div className='flex flex-col flex-1'>
                          <p className='font-bold text-gray-950'>{user.username}</p>
                        </div>

                        <div>
                          {newMessageUsers.ReceiverId === authUser._id && newMessageUsers.SenderId === user._id ?
                            <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">+1</div> : <></>
                          }
                        </div>

                      </div>
                      <div className='divider divide-solid px-3 h-[1-px]'></div>
                    </div>
                  ))}
                </>
              )}
            </div>

          </div>

          <div className='mt-auto px-1 py-1 flex'>

            <button onClick={handleLogOut} className='hover:bg-red-600 w-10 cursor-pointer hover:text-white rounded-lg'>
              <BiLogOut size={25} />
            </button>
            <p className='text-sm py-1'>LogOut</p>
          </div>
        </>

      )}
    </div>
  )
}

export default Sidebar
