import { createSlice } from "@reduxjs/toolkit";
import { addToCart as addToFirestoreCart, removeFromCart as removeFromFirestoreCart } from "../Services/firebase-auth-service";
import { updateUserCart } from "../store/auth-slice";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        itemsList: [],
        totalQuantity: 0,
        showCart: false,
        loading: false,
        error: null
    },
    reducers: {
        setCartItems(state, action) {
            state.itemsList = action.payload;
            state.totalQuantity = action.payload.reduce((total, item) => total + item.quantity, 0);
        },
        addToCart(state, action) {
            const newItem = action.payload;
            
            // Find if the item already exists in the cart
            const existingItemIndex = state.itemsList.findIndex((item) => item.articleNo === newItem.articleNo);
            
            if (existingItemIndex !== -1) {
                // Update existing item
                state.itemsList[existingItemIndex].quantity++;
                state.itemsList[existingItemIndex].price += newItem.price;
                state.totalQuantity++;
            } else {
                // Add new item
                state.itemsList.push({
                    id: newItem.id,
                    productName: newItem.productName,
                    price: newItem.price,
                    articleNo: newItem.articleNo,
                    quantity: 1,
                    division: newItem.division,
                    category: newItem.category,
                    imageUrl: newItem.imageUrl,
                    totalPrice: newItem.price,
                    name: newItem.productname || newItem.productName,
                });
                state.totalQuantity++;
            }
        },
        removeFromCart(state, action) {
            const articleNo = action.payload;
            const existingItemIndex = state.itemsList.findIndex((item) => item.articleNo === articleNo);
            
            if (existingItemIndex !== -1) {
              const existingItem = state.itemsList[existingItemIndex];
              state.itemsList = state.itemsList.filter((item) => item.articleNo !== articleNo);
              state.totalQuantity = state.totalQuantity-existingItem.quantity;
            }
          },
          clearCart(state) {
      state.itemsList = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
        setShowCart(state, action) {
            state.showCart = action.payload !== undefined ? action.payload : !state.showCart;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        }
    }
});

// Thunk for adding to cart with Firestore sync
export const addToCartWithSync = (item, userId) => async (dispatch, getState) => {
    try {
        dispatch(cartSlice.actions.setLoading(true));
        
        // First update Redux state
        dispatch(cartSlice.actions.addToCart(item));
        
        // Then sync with Firestore if user is logged in
        if (userId) {
            const cartItems = getState().cart.itemsList;
            await addToFirestoreCart(userId, item);
            dispatch(updateUserCart(cartItems));
        }
    } catch (error) {
        dispatch(cartSlice.actions.setError(error.message));
    } finally {
        dispatch(cartSlice.actions.setLoading(false));
    }
};

// Thunk for removing from cart with Firestore sync
export const removeFromCartWithSync = (articleNo, userId) => async (dispatch, getState) => {
    try {
        dispatch(cartSlice.actions.setLoading(true));
        
        // First update Redux state
        dispatch(cartSlice.actions.removeFromCart(articleNo));
        
        // Then sync with Firestore if user is logged in
        if (userId) {
            const cartItems = getState().cart.itemsList;
            await removeFromFirestoreCart(userId, articleNo);
            dispatch(updateUserCart(cartItems));
        }
    } catch (error) {
        dispatch(cartSlice.actions.setError(error.message));
    } finally {
        dispatch(cartSlice.actions.setLoading(false));
    }
};

export const cartActions = {
    ...cartSlice.actions,
    addToCartWithSync,
    removeFromCartWithSync
};

export default cartSlice;