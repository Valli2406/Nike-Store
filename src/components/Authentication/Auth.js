import React, { useState, useEffect } from 'react';
import './Auth.css';
import { SiNike, SiJordan } from "react-icons/si";
import { useDispatch } from 'react-redux';
import { login } from '../../store/auth-slice';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../../Services/firebase-auth-service';
import { auth } from '../../Firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData } from '../../Services/firebase-auth-service';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../toastutil';
function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user data from Firestore
          const userData = await getUserData(user.uid);
          
          dispatch(login({
            email: user.email,
            name: user.displayName || userData?.displayName || user.email.split('@')[0],
            uid: user.uid,
            photo: user.photoURL,
            loggedIn: true,
            cart: userData?.cart || [],
            favorites: userData?.favorites || []
          }));
          
          // navigate('/');
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let user;
      
      if (isLogin) {
        // Sign in existing user
        user = await signInWithEmail(email, password);
      } else {
        // Create new user
        user = await signUpWithEmail(email, password);
      }
      
      // Fetch user data from Firestore
      const userData = await getUserData(user.uid);
      
      dispatch(login({
        email: user.email,
        name: userData?.displayName || user.email.split('@')[0],
        uid: user.uid,
        photo: user.photoURL,
        loggedIn: true,
        cart: userData?.cart || [],
        favorites: userData?.favorites || []
      }));
      
      showSuccessToast(`Successfully ${isLogin ? 'signed in' : 'signed up'}!`);
      navigate('/');
    } catch (error) {
      console.error("Auth Error:", error);
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      const user = await signInWithGoogle();
      
      // Fetch user data from Firestore
      const userData = await getUserData(user.uid);
      
      dispatch(login({
        email: user.email,
        name: user.displayName || userData?.displayName,
        uid: user.uid,
        photo: user.photoURL,
        loggedIn: true,
        cart: userData?.cart || [],
        favorites: userData?.favorites || []
      }));
      
      showSuccessToast("Successfully signed in with Google!");
      navigate('/');
    } catch (error) {
      console.error("Google Sign-In Error", error);
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='whole'>
      <form className='box' onSubmit={handleEmailAuth}>
        <div className='logos'><SiNike /><SiJordan /></div>
        <h1>{isLogin ? 'Sign in to your account' : 'Create a new account'}</h1>
        <p>India</p>
        
        <input
          required
          placeholder='Email*'
          className='input'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input
          required
          placeholder='Password*'
          className='input'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <p className='tc'>
          By continuing, I agree to Nike's <a href='https://agreementservice.svs.nike.com/rest/agreement?agreementType=privacyPolicy&country=IN&language=en&requestType=redirect&uxId=4fd2d5e7db76e0f85a6bb56721bd51df' target='_blank' rel="noreferrer">Privacy Policy</a> and <a href='https://agreementservice.svs.nike.com/rest/agreement?agreementType=termsOfUse&country=IN&language=en&requestType=redirect&uxId=4fd2d5e7db76e0f85a6bb56721bd51df' target='_blank' rel="noreferrer">Terms of Use</a>
        </p>
        
        <button type="submit" disabled={loading} className="btn">
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
        </button>
        
        <div className="divider">OR</div>
        
        <button type="button" onClick={handleGoogleSignIn} className="google-btn" disabled={loading}>
          Sign in with Google
        </button>
        
        <p className="switch-mode">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} className="switch-link">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </form>
      
    </div>
  );
}

export default Auth;

