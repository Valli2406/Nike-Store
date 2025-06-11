import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Favourite.css';
import FavouriteProduct from './FavouriteProduct';
import { favouriteActions } from '../../store/Favourite-slice';

function Favourite() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const favouriteproduct = useSelector((state) => state.favourites.favouritelist);
  const totalQuantity = favouriteproduct.length;

  useEffect(() => {
    // If user is not logged in, redirect to auth page
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Set favorite items from user data when component mounts
  useEffect(() => {
    if (user && user.favorites && user.favorites.length > 0) {
      dispatch(favouriteActions.setFavoriteItems(user.favorites));
    }
  }, [user, dispatch]);

  if (!user) {
    return <div className="loading">Please sign in to view your favorites</div>;
  }

  return (
    <>
      {totalQuantity === 0 ? (
        <div className='font'>
          <h1>Favorites</h1>
          <h3>Your favorite products will be displayed here...</h3>
          <button onClick={() => navigate('/products')} className="continue-btn">Continue Shopping</button>
        </div>
      ) : (
        <div className='font'>
          <h1>Favorites</h1>
          <div className='favflex'>
            {favouriteproduct.map(item => (
              <div key={item.articleNo}>
                <FavouriteProduct favouriteproduct={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Favourite;