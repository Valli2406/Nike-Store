import { 
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut,
    doc, 
    getDoc, 
    setDoc, 
    updateDoc,
    GoogleAuthProvider,
    googleProvider,
    signInWithPopup,
    arrayUnion,
    arrayRemove
  } from '../Firebase-config';
  
  // Authentication methods
  export const signUpWithEmail = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create a user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName: displayName || email.split('@')[0],
        createdAt: new Date().toISOString(),
        cart: [],
        favorites: []
      });
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
  
  export const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
  
  export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      // If user document doesn't exist, create it
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          cart: [],
          favorites: []
        });
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  };
  
  export const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // User data methods
  export const getUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      throw error;
    }
  };
  
  // Cart methods
  export const updateUserCart = async (userId, cartItems) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        cart: cartItems
      });
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  export const addToCart = async (userId, item) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const cart = userData.cart || [];
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(cartItem => cartItem.articleNo === item.articleNo);
        
        if (existingItemIndex !== -1) {
          // Update existing item
          cart[existingItemIndex].quantity += 1;
          cart[existingItemIndex].price += item.price / item.quantity;
        } else {
          // Add new item
          cart.push(item);
        }
        
        // Update cart in Firestore
        await updateDoc(doc(db, "users", userId), { cart });
        return cart;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };
  
  export const removeFromCart = async (userId, articleNo) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      let cart = userData.cart || [];
      
      // Simply remove the item entirely instead of reducing quantity
      cart = cart.filter(item => item.articleNo !== articleNo);
      
      // Update cart in Firestore
      await updateDoc(doc(db, "users", userId), { cart });
      
      return cart;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

  
  export const addToFavorites = async (userId, item) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favorites = userData.favorites || [];
        
        // Check if item already exists in favorites
        const existingItemIndex = favorites.findIndex(favItem => favItem.articleNo === item.articleNo);
        
        if (existingItemIndex === -1) {
          // Add new item
          favorites.push(item);
          
          // Update favorites in Firestore
          await updateDoc(doc(db, "users", userId), { favorites });
        }
        
        return favorites;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };
  
  export const removeFromFavorites = async (userId, articleNo) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        let favorites = userData.favorites || [];
        
        // Remove item from favorites
        favorites = favorites.filter(item => item.articleNo !== articleNo);
        
        // Update favorites in Firestore
        await updateDoc(doc(db, "users", userId), { favorites });
        
        return favorites;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };