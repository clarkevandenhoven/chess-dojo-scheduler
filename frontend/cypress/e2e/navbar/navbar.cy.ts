const navbarStartItems = [
    'Profile',
    'Scoreboard',
    'Tournaments',
    'Games',
    'Calendar',
    'Meetings',
    'Recent',
    'Material',
    'Merch',
];

const navbarEndItems = ['Help', 'Sign Out'];

const viewPortWidths = [
    { width: 1372, hidden: 0, endHidden: 0 },
    { width: 1242, hidden: 2, endHidden: 0 },
    { width: 1148, hidden: 3, endHidden: 0 },
    { width: 1023, hidden: 4, endHidden: 0 },
    { width: 896, hidden: 5, endHidden: 0 },
    { width: 794, hidden: 6, endHidden: 0 },
    { width: 634, hidden: 7, endHidden: 1 },
    { width: 555, hidden: 7, endHidden: 2 },
    { width: 449, hidden: 9, endHidden: 2 },
];

describe('Navbar', () => {
    it('should have limited options when unauthenticated', () => {
        cy.visit('/');

        cy.getBySel('navbar').contains('Tournaments');
        cy.getBySel('navbar').contains('Signin');
        cy.getBySel('navbar').contains('Signup');
        cy.getBySel('navbar').get('Profile').should('not.exist');
        cy.getBySel('navbar').get('Sign Out').should('not.exist');

        cy.viewport(449, 660);

        cy.getBySel('navbar-more-button').click();
        cy.get('#menu-appbar').contains('Tournaments');
        cy.get('#menu-appbar').contains('Signin');
        cy.get('#menu-appbar').contains('Signup');
        cy.get('#menu-appbar').get('Profile').should('not.exist');
    });

    viewPortWidths.forEach(({ width, hidden, endHidden }) => {
        it(`shows correct authenticated items with ${width}px width`, () => {
            cy.viewport(width, 660);
            cy.loginByCognitoApi(
                'navbar',
                Cypress.env('cognito_username'),
                Cypress.env('cognito_password')
            );

            navbarStartItems
                .slice(0, navbarStartItems.length - hidden)
                .forEach((item) => {
                    cy.getBySel('navbar').contains(item);
                });

            navbarEndItems
                .slice(endHidden)
                .forEach((item) => cy.getBySel('navbar').contains(item));

            if (hidden > 0) {
                cy.getBySel('navbar-more-button').click();

                navbarStartItems
                    .slice(navbarStartItems.length - hidden)
                    .forEach((item) => cy.get('#menu-appbar').contains(item));

                navbarEndItems
                    .slice(0, endHidden)
                    .forEach((item) => cy.get('#menu-appbar').contains(item));
            }
        });
    });
});