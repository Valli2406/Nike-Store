import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser, selectExtractedUsername } from '../../store/auth-slice';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase-config';
import './Logout.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const extractedUsername = useSelector(selectExtractedUsername);
 const navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      dispatch(logout());
      toast.success("Successfully logged out.");
      navigate("/")
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to log out.");
    }
  };

  return (
    <div className='logoutbody'>
      <div className='alignment'>
        {user ? (
          <div className='logoutcontent'>
            <p>Welcome <span>{extractedUsername}</span>!!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <p>Please log in.</p>
        )}
      </div>
    </div>
  );
}

export default Logout;
