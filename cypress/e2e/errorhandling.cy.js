describe('Error Page', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://boardgamebuddy-api-a3b5bf335532.herokuapp.com/users', {
      fixture: 'mockUsers',
    }).as('getUsers');
    cy.intercept('GET', 'https://middleman-api-8d134831a182.herokuapp.com/api/v1/board_games', {
      fixture: 'mockGames',
    }).as('getUsers');
    cy.intercept('GET', 'https://boardgamebuddy-api-a3b5bf335532.herokuapp.com/users/10/favorites')
  });

  it('should display the header with image, home, and about sections', () => {
    cy.visit('https://board-game-buddy-ui.vercel.app/fakeurl');
    cy.get('nav').should('exist')
    .find('.logo').should('exist');
    cy.get('nav')
    .find('.a').should('exist').should('have.text', "Home")
    cy.get('nav')
    .find('.links > :nth-child(2) > a').should('exist');
    cy.get('.error-image').should('exist')
    cy.get('.error-message').should('have.text', 'Oh no! Unknown error occurred.')
    cy.get('.return-button').should('have.text', "Return Home")
  });
});
