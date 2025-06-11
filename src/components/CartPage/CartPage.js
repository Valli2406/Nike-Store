import React, { useEffect } from 'react';
import './CartPage.css';
import CartProduct from './CartProduct';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cartActions } from '../../store/cart-slice';
import { showSuccessToast } from '../toastutil';
function CartPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const itemproduct = useSelector((state) => state.cart.itemsList);
    const totalPrice = itemproduct.reduce((acc, item) => acc + item.price, 0);
    const totalQuantity = itemproduct.reduce((acc, item) => acc + item.quantity, 0);
    const shipping = totalQuantity * 5;

    useEffect(() => {
        // If user is not logged in, redirect to auth page
        if (!user) {
            navigate('/auth');
        }
    }, [user, navigate]);

    // Set cart items from user data when component mounts
    useEffect(() => {
        if (user && user.cart && user.cart.length > 0) {
            dispatch(cartActions.setCartItems(user.cart));
        }
    }, [user, dispatch]);

    const handleCheckout = () => {
        // Implement checkout logic here
        showSuccessToast("Order Placed Succesfuly");
        
    };

    if (!user) {
        return <div className="loading">Please sign in to view your cart</div>;
    }

    return (
        <>
            <div className='page'>
                <div className='favflex'>
                    <section className='cartpagebody'>
                        <div className='freeshipping'>
                            <h2>Free Shipping For Nike Membership</h2>
                            <p>
                                {user ? 
                                    `Welcome, ${user.name || user.email.split('@')[0]}! Enjoy free shipping on your orders.` : 
                                    `Become a Nike Member for fast and free shipping 
                                    <button onClick={() => navigate('/auth')}>join us</button> 
                                    <button onClick={() => navigate('/auth')}>sign in</button>`
                                }
                            </p>
                        </div>
                    </section>
                    <div className='summary'>
                        <h1>Summary</h1>
                        <p>Total price: ${totalPrice.toFixed(2)}</p>
                        <hr />
                        <p>Total: ${(totalPrice).toFixed(2)}</p>
                        <button 
                            className='cartbutton' 
                            onClick={handleCheckout}
                            disabled={totalQuantity === 0}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
                
                <div className='favflex mt'>
                    {totalQuantity === 0 ? (
                        <div className="empty-cart">
                            <h2>Your cart is empty</h2>
                            <p>Add items to your cart to see them here</p>
                            <button onClick={() => navigate('/products')} className="continue-btn">Continue Shopping</button>
                        </div>
                    ) : (
                        itemproduct.map(item => (
                            <div key={item.articleNo}>
                                <CartProduct itemproduct={item} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default CartPage;