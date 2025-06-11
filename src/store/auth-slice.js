import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
    },
    reducers: {
        login(state, action) {
            state.user = action.payload;
        },
        logout(state) {
            state.user = null;
        },
        updateUserCart(state, action) {
            if (state.user) {
                state.user.cart = action.payload;
            }
        },
        updateUserFavorites(state, action) {
            if (state.user) {
                state.user.favorites = action.payload;
            }
        }
    }
});

export const { login, logout, updateUserCart, updateUserFavorites } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectExtractedUsername = (state) => {
    const user = state.auth.user;
    if (user && user.email) {
        const email = user.email;
        const atIndex = email.indexOf('@');
        if (atIndex !== -1) {
            return email.slice(0, atIndex);
        }
    }
    return null;
};

export default authSlice.reducer;