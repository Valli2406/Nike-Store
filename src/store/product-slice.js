import { createSlice } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase-config'; 


const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    setProducts(state, action) {
      state.products = action.payload;
      state.status = 'succeeded';
    },
    setLoading(state) {
      state.status = 'loading';
    },
    setError(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    }
  },
});

export const { setProducts, setLoading, setError } = productSlice.actions;

// ✅ Fetch products from Firebase Firestore
export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading());

    const querySnapshot = await getDocs(collection(db, "products"));
    const productList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    dispatch(setProducts(productList));
  } catch (error) {
    dispatch(setError(error.message));
    console.error('Error fetching products from Firestore:', error);
  }
};

export default productSlice.reducer;
