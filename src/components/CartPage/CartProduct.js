import React from 'react'
import './CartProduct.css'
import Dropdown from './Dropdown'
import { MdDelete } from "react-icons/md";
import { showSuccessToast } from '../toastutil';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCartWithSync } from '../../store/cart-slice';
function CartProduct({itemproduct}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const removeFromCart = () => {
    dispatch(removeFromCartWithSync(itemproduct.articleNo, user.uid));
    showSuccessToast("Removed from cart successfully!");
  };

  return (
    <>
      <div className='favflex'>
      <img src={itemproduct.imageUrl} alt={itemproduct.productName} className='image' />
      <div className='content'>
            <p className='title'>{itemproduct.productName}</p>
            <p className='description'> <span>{itemproduct.division} </span><span>{itemproduct.category} </span></p>
             <span><Dropdown/>  <button className='btn' onClick={removeFromCart}><MdDelete className='nav-icons' /></button></span>
           <div className='quantity'> Quantity: {itemproduct.quantity} </div>
           <p>Price: {itemproduct.totalPrice} $</p>
           <p>TotalPrice: {itemproduct.price} $</p>
          
      </div>
     
      </div>
    </>
  )
}

export default CartProduct