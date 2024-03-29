export function getBoardGames() {
    return fetch("https://middleman-api-8d134831a182.herokuapp.com/api/v1/board_games").then(
      (response) => {
        if (!response.ok) {
          throw new Error(`Board games not found`)
        }
        return response.json()
      }
    )
  }

export function getSelectedGame(id) {
  return fetch(`https://middleman-api-8d134831a182.herokuapp.com/api/v1/board_games/${id}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Game not found.')
    }
    return response.json()
  })
}

export function getSearchedGames(searchCriteria) {
  return fetch(`https://middleman-api-8d134831a182.herokuapp.com/api/v1/board_games/all_by_params?${searchCriteria}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Category games not found.')
    }
    return response.json()
  })
}

export function getUsers() {
  return fetch(`https://boardgamebuddy-api-a3b5bf335532.herokuapp.com/users`).then(
    (response) => {
      if (!response.ok) {
        throw new Error(`Users not found.`)
      }
     return response.json()
    })
}

export function getGamesByPage(pageNumber) {
  return fetch(`https://middleman-api-8d134831a182.herokuapp.com/api/v1/board_games/all_by_params?page=${pageNumber}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('That page does not exist.');
      }
      return response.json();
    });
}

export function getGamesByCategories(categories) {
  const queryParams = categories ? `categories=${categories}` : '';

  return fetch(`https://middleman-api-8d134831a182.herokuapp.com/api/v1/board_games/all_by_params?${queryParams}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Category games not found.');
      }
      return response.json();
    });
}

export function getGamesByPageAndCategories(page, categories, title) {
  let queryString = `page=${page}`;

  if (categories) {
    queryString += `&categories=${categories}`;
  }

  if (title) {
    queryString += `&title=${title}`;
  }

  return fetch(`https://middleman-api-8d134831a182.herokuapp.com/api/v1/board_games/all_by_params?${queryString}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching filtered page.');
      }
      return response.json();
    });
}





