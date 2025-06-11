import { createSlice } from "@reduxjs/toolkit";
import { addToFavorites as addToFirestoreFavorites, removeFromFavorites as removeFromFirestoreFavorites } from "../Services/firebase-auth-service";
import { updateUserFavorites } from "../store/auth-slice";

const favouriteSlice = createSlice({
    name: 'favourites',
    initialState: {
        favouritelist: [],
        totalQuantity: 0,
        showFavourite: false,
        loading: false,
        error: null
    },
    reducers: {
        setFavoriteItems(state, action) {
            state.favouritelist = action.payload;
            state.totalQuantity = action.payload.length;
        },
        addToFavourite(state, action) {
            const newItem = action.payload;
            
            // Check if item already exists in favorites
            const existingItemIndex = state.favouritelist.findIndex((item) => item.articleNo === newItem.articleNo);
            
            if (existingItemIndex === -1) {
                // Add new item only if it doesn't exist
                state.favouritelist.push({
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
        removeFromFavourite(state, action) {
            const articleNo = action.payload;
            
            // Remove item from favorites
            const initialLength = state.favouritelist.length;
            state.favouritelist = state.favouritelist.filter((item) => item.articleNo !== articleNo);
            
            // Update total quantity if an item was removed
            if (state.favouritelist.length < initialLength) {
                state.totalQuantity--;
            }
        },
        setShowFavourite(state, action) {
            state.showFavourite = action.payload !== undefined ? action.payload : !state.showFavourite;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        }
    }
});

// Thunk for adding to favorites with Firestore sync
export const addToFavouritesWithSync = (item, userId) => async (dispatch, getState) => {
    try {
        dispatch(favouriteSlice.actions.setLoading(true));
        
        // First update Redux state
        dispatch(favouriteSlice.actions.addToFavourite(item));
        
        // Then sync with Firestore if user is logged in
        if (userId) {
            const favoriteItems = getState().favourites.favouritelist;
            await addToFirestoreFavorites(userId, item);
            dispatch(updateUserFavorites(favoriteItems));
        }
    } catch (error) {
        dispatch(favouriteSlice.actions.setError(error.message));
    } finally {
        dispatch(favouriteSlice.actions.setLoading(false));
    }
};

// Thunk for removing from favorites with Firestore sync
export const removeFromFavouritesWithSync = (articleNo, userId) => async (dispatch, getState) => {
    try {
        dispatch(favouriteSlice.actions.setLoading(true));
        
        // First update Redux state
        dispatch(favouriteSlice.actions.removeFromFavourite(articleNo));
        
        // Then sync with Firestore if user is logged in
        if (userId) {
            const favoriteItems = getState().favourites.favouritelist;
            await removeFromFirestoreFavorites(userId, articleNo);
            dispatch(updateUserFavorites(favoriteItems));
        }
    } catch (error) {
        dispatch(favouriteSlice.actions.setError(error.message));
    } finally {
        dispatch(favouriteSlice.actions.setLoading(false));
    }
};

export const favouriteActions = {
    ...favouriteSlice.actions,
    addToFavouritesWithSync,
    removeFromFavouritesWithSync
};

export default favouriteSlice.reducer;