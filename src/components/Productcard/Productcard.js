import React from 'react';
import { FiHeart } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';
import './Productcard.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCartWithSync } from '../../store/cart-slice';
import { addToFavouritesWithSync } from '../../store/Favourite-slice';
import { showSuccessToast, showInfoToast } from '../toastutil';
function Productcard({ productItem }) {
    const productName = productItem.productName;
    const articleNo = productItem.articleNo;
    const price = productItem.salePrice ? productItem.salePrice : productItem.listPrice;
    const imageUrl = productItem.imageUrl;
    const division = productItem.division;
    const category = productItem.category;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    
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
    
    const addToFavourite = () => {
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
        
        dispatch(addToFavouritesWithSync(item, user.uid));
        showSuccessToast("Added to favorites successfully!");
    };

    return (
        <>
            <div className='product-card'>
                <img src={productItem.imageUrl} alt={productItem.productName} className='image' />
                <div className='content'>
                    <h3 className='tittle'>{productItem.productName}</h3>
                    <p className='description'>
                        <span>{productItem.division} </span>
                        <span>{productItem.category} </span>
                    </p>
                    <div className='inline'>
                        <div className='price'>
                            {productItem.salePrice ? (
                                <div>
                                    <span style={{ textDecoration: 'line-through', color: 'grey', marginRight: '10px' }}>
                                        ${productItem.listPrice}
                                    </span>
                                    <span style={{ color: 'green' }}>
                                        ${productItem.salePrice}
                                    </span>
                                </div>
                            ) : (
                                <span>${productItem.listPrice}</span>
                            )}
                        </div>

                        <button className='btn' onClick={addToCart}>
                            <IoBagOutline className='nav-icons' />
                        </button>
                        
                        <button className='btn' onClick={addToFavourite}>
                            <FiHeart className='nav-icons' />
                        </button>
                    </div>
                </div>
            </div>
          
        </>
    );
}

export default Productcard;