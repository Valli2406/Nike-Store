import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { cartActions } from "./store/cart-slice";
import { favouriteActions } from "./store/Favourite-slice";

export const loadUserData = async (uid, dispatch) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
       dispatch(cartActions.clearCart());
      if (data.cart && Array.isArray(data.cart)) {
        // Set cart items at once to ensure proper initialization
        dispatch(cartActions.setCartItems(data.cart));
      }
      if (data.favourites) {
        data.favourites.forEach(item => dispatch(favouriteActions.addToFavourite(item)));
      }
    }
  } catch (err) {
    console.error("Error loading user data:", err);
  }

};
 if (data.cart && Array.isArray(data.cart)) {
        // Make sure each cart item has valid properties
        data.cart.forEach(item => {
          if (item && typeof item === 'object' && item.articleNo) {
            // Ensure quantity and price are numbers
            const validItem = {
              ...item,
              quantity: Number(item.quantity) || 1,
              price: Number(item.price) || 0
            };
            dispatch(cartActions.addToCart(validItem));
          }
        });
      }
