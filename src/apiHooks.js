import { useDispatch } from 'react-redux';

import { addFavorite, removeFavorite, initFavorites } from './Redux/favoriteCardsSlice';

import { addUserProfile, updateUserProfile, removeUserProfile } from './Redux/userProfileSlice';

export function useApi() {
  const dispatch = useDispatch();

  const getUserFavorites = (userID) => {
    // console.log('Fetching user favorites for userID:', userID);

    return fetch(`https://boardgamebuddy-api-a3b5bf335532.herokuapp.com/users/${userID}/favorites`)
      .then(response => {
        if (!response.ok) {
          throw new Error('User favorites not found.');
        }
        return response.json();
      })
      .then(data => {
        // console.log('User favorites fetched successfully:', data);
        dispatch(initFavorites({ userID, favorites: data }));
        return data;
      })
      .catch(error => {
        console.error('Error fetching user favorites:', error);
        throw error; // Rethrow the error to propagate it to the caller
      });
  };

  const postUserFavorite = (userID, gameID) => {
    // console.log('Saving favorite for userID:', userID, 'gameID:', gameID);

    return fetch(`https://boardgamebuddy-api-a3b5bf335532.herokuapp.com/users/${userID}/favorites?board_game_id=${gameID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to add favorite. Status: ${response.status}`);
        }
        dispatch(addFavorite({ userID, cardID: gameID.toString() }));
        // console.log('Favorite added successfully.');
        return response.json();
      })
      .catch(error => {
        console.error('Error saving favorite:', error);
        throw error; // Rethrow the error to propagate it to the caller
      });
  };

  const deleteUserFavorite = (userID, gameID) => {
    // console.log('Deleting favorite for userID:', userID, 'gameID:', gameID);

    return fetch(`https://boardgamebuddy-api-a3b5bf335532.herokuapp.com/users/${userID}/favorites?board_game_id=${gameID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to delete favorite. Status: ${response.status}`);
        }
        dispatch(removeFavorite({ userID, cardID: gameID.toString() }));
        // console.log('Favorite deleted successfully.');
        return { success: true };
      })
      .catch(error => {
        console.error('Error deleting favorite:', error);
        return { success: false, error: error.message };
      });
  };

  const createUserProfile = async (data) => {
    try {
      const response = await fetch('https://boardgamebuddy-api-a3b5bf335532.herokuapp.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create user profile');
      }

      const responseData = await response.json();

      dispatch(addUserProfile({ userID: responseData.data.id, userData: responseData.data.attributes }));

      return responseData;
    } catch (error) {
      throw error;
    }
  };

  const deleteUserProfile = (userID) => {
    console.log('Deleting UserProfileID:', userID);

    return fetch(`https://boardgamebuddy-api-a3b5bf335532.herokuapp.com/users/${userID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to delete favorite. Status: ${response.status}`);
        }
        dispatch(removeUserProfile({ userID }));
        console.log('Favorite deleted successfully.');
        return { success: true };
      })
      .catch(error => {
        console.error('Error deleting favorite:', error);
        return { success: false, error: error.message };
      });
  };

  return { getUserFavorites, postUserFavorite, deleteUserFavorite, createUserProfile, deleteUserProfile };
}
