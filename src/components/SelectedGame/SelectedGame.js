import './SelectedGame.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSelectedGame } from '../../apiCalls';
import { useSelector, useDispatch } from 'react-redux';
import filled from '../../Assets/filled.png';
import unfilled from '../../Assets/unfilled.png';
import back from '../../Assets/Back.png';
import { useApi } from '../../apiHooks';
import { initFavorites } from '../../Redux/favoriteCardsSlice';

function SelectedGame({ setServerError, currentUser }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const numID = parseInt(currentUser);
  const [selectedGame, setSelectedGame] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false)
  const userFaves = useSelector((state) => state.favoriteCards[currentUser] || []);

  useEffect(() => {
    getSelectedGame(id)
      .then((data) => {
        setSelectedGame(data.data);
      })
      .catch((error) => {
        setServerError({ hasError: true, message: `${error.message}` });
      });
  }, [id, setServerError]);

  useEffect(() => {
    let newIsFavorite = userFaves.some((favorite) => favorite.id === id);

    setIsFavorite((prevIsFavorite) => {
      if (newIsFavorite !== prevIsFavorite) {
        return newIsFavorite;
      }
      return prevIsFavorite;
    });
  }, [id, userFaves]);

  const { postUserFavorite, deleteUserFavorite, getUserFavorites } = useApi();

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await deleteUserFavorite(numID, id);
      } else {
        await postUserFavorite(numID, id);
      }
  
      // Manually update the userFaves state
      setIsFavorite(!isFavorite);
  
      // Fetch and initialize user favorites
      const updatedFavorites = await getUserFavorites(numID);
      dispatch(initFavorites({ userID: numID, favorites: updatedFavorites }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const replaceLineBreaks = (text) => {
    return text.replace(/&#10;/g, '<br />');
  };

  function generateStars(rating) {
    const totalStars = 5;
    const fullStars = Math.round(rating / 2);
    const remainingStars = totalStars - fullStars;

    const stars = Array.from({ length: fullStars }, (_, index) => (
      <span key={index} role="img" aria-label="star">
        ⭐
      </span>
    ));

    const transparentStars = Array.from({ length: remainingStars }, (_, index) => (
      <span key={fullStars + index} role="img" aria-label="star" className="transparent-star">
        ⭐
      </span>
    ));

    return [...stars, ...transparentStars];
  }

  return selectedGame && (
    <div className="entire-page">
      <div className="selected-game-container">
        <div className="selected-game-info">
          <div className="header-container">          <Link to={`/${currentUser}/home`}>
            <img src={back} alt="back button" className="back-button" />
          </Link>
          <div className="selected-favorite-button" id="save" onClick={toggleFavorite}>
            {isFavorite ? (
              <img src={filled} alt="filled in collection icon showing that this game is saved to the users favorites" style={{ cursor: 'pointer', fontSize: '1.3em' }} />
            ) : (
              <img src={unfilled} alt="unfilled collection icon showing that this game is not saved to the users favorites" style={{ fontSize: '1.3em' }} />
            )}
          </div></div>

          <div className="above-image">
            <h1 className="game-title">{selectedGame.attributes.title}</h1>
            <h3 className="players">Players: {selectedGame.attributes.min_players}-{selectedGame.attributes.max_players}</h3>
            <div className="image-container">
            </div>
            {selectedGame.attributes.rating > 0 ? (
              <h3 className="rating">
                Rating: {(selectedGame.attributes.rating / 2).toFixed(1)}/5 {generateStars(selectedGame.attributes.rating)}

              </h3>
            ) : (
              <h3 className="rating">Average Rating: Not yet rated</h3>
            )}
          </div>
            <img className="selected-game-image" src={selectedGame.attributes.image_path} alt={`boardgame cover for ${selectedGame.attributes.title}`} />

          <h3 className="categories">Categories: {selectedGame.attributes.categories}</h3>
    
        </div>
        <div className="selected-game-instructions-container">
          <p className="game-instructions" dangerouslySetInnerHTML={{ __html: replaceLineBreaks(selectedGame.attributes.description) }}></p>
        </div>
      </div>
    </div>
  );
}

export default SelectedGame;

SelectedGame.propTypes = {
  setServerError: PropTypes.func.isRequired,
  currentUser: PropTypes.number,
};
