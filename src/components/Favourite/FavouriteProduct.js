import Dropdown from '../CartPage/Dropdown'
import React from 'react'
import { MdDelete } from "react-icons/md";
import { IoBagOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { addToCartWithSync } from '../../store/cart-slice';
import { removeFromFavouritesWithSync } from '../../store/Favourite-slice';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccessToast, showInfoToast } from '../toastutil';
import './FavouriteProduct.css'
function FavouriteProduct({ favouriteproduct }) {
  const dispatch = useDispatch();
  const productName = favouriteproduct.productName;
  const articleNo = favouriteproduct.articleNo;
  const price = favouriteproduct.price;
  const imageUrl = favouriteproduct.imageUrl;
  const division = favouriteproduct.division;
  const category = favouriteproduct.category;
  const navigate = useNavigate();
  const user =  useSelector(state => state.auth.user);
const addToCart = () => {
        if (!user) {
          showInfoToast("Please sign in to add items");
            setTimeout(() => {
                navigate('/auth');
            }, 2000);
            return;
        }
        
        const item = {
            productName,
            articleNo,
            price,
            imageUrl,
            division,
            category,
        };
        
        dispatch(addToCartWithSync(item, user.uid));
        showSuccessToast("Added to cart successfully!");
    };
  const removeFromFavourite = () => {
    dispatch(removeFromFavouritesWithSync(favouriteproduct.articleNo, user.uid));
    showSuccessToast("Removed from favorites successfully!");
  };

  return (
    <>

      <div className='favourite'>
        <img src={favouriteproduct.imageUrl} alt={favouriteproduct.productName} className='favimage' />
        <div className='alignment'>
          <h3 className='favtitle'>{favouriteproduct.productName}</h3>
          <button className='btn' onClick={addToCart}><IoBagOutline className='nav-icons' /></button>
          <button className='btn' onClick={removeFromFavourite}><MdDelete className='nav-icons' /></button>
        </div>
        <p className='description '> <span>{favouriteproduct.division} </span><span>{favouriteproduct.category} </span></p>
        <div className='flex fav'>
          <p>{favouriteproduct.price}$</p>
          <Dropdown storageKey="dropdown1" />
        </div>
       
      </div>

      {/* // const articleNo = action.payload;
            // const existingItem = state.favouritelist.find((item) => item.articleNo === articleNo);
            // if (existingItem) {

            //     state.favouritelist = state.favouritelist.filter((item) => item.articleNo !== articleNo);
            //     state.totalQuantity--;

            // }
    */}
    </>
  )
}

export default FavouriteProduct