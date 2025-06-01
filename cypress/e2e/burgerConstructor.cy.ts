import mockOrderResponse from '../fixtures/order.json';
import mockTokenResponse from '../fixtures/token.json';
import mockIngredientsResponse from '../fixtures/ingredients.json';
import { deleteCookie, setCookie } from '../../src/utils/cookie';

describe('burgerConstructor', () => {
  // мокаем данные с сервера
  beforeEach(() => {
    setCookie('accessToken', mockTokenResponse.accessToken);
    localStorage.setItem('refreshToken', mockTokenResponse.refreshToken);

    cy.intercept('GET', '/api/auth/token', { fixture: 'token.json' });
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' });

    cy.visit('http://localhost:4000/');
  });

  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('Отображение ингредиентов', () => {
    cy.get('h1').should('contain', 'Соберите бургер');
    cy.get('h3:nth-of-type(1)').should('contain', 'Булки');
    cy.get('ul:nth-of-type(1)').find('li').should('have.length', 2);
    cy.get('h3:nth-of-type(2)').should('contain', 'Начинки');
    cy.get('ul:nth-of-type(2)').find('li').should('have.length', 9);
    cy.get('h3:nth-of-type(3)').should('contain', 'Соусы');
    cy.get('ul:nth-of-type(3)').find('li').should('have.length', 4);
  });

  it('Добавление ингредиентов', () => {
    cy.get('ul:nth-of-type(1) > li:first-child > button').click({
      multiple: true
    });
    cy.get('ul:nth-of-type(2) > li:first-child > button').click({
      multiple: true
    });
    cy.get('ul:nth-of-type(3) > li:first-child > button').click({
      multiple: true
    });

    cy.get('section:nth-of-type(2)')
      .find('div:nth-of-type(1)')
      .should('contain', 'Краторная булка N-200i (верх)');
    cy.get('section:nth-of-type(2)')
      .find('div:nth-of-type(2)')
      .should('contain', 'Краторная булка N-200i (низ)');
    cy.get('section:nth-of-type(2) > ul').find('li').should('have.length', 2);
    cy.get('section:nth-of-type(2) > ul')
      .find('li:nth-of-type(1)')
      .should('contain', 'Биокотлета из марсианской Магнолии');
    cy.get('section:nth-of-type(2) > ul')
      .find('li:nth-of-type(2)')
      .should('contain', 'Соус Spicy-X');
  });

  it('Открытие и закрытие модального окна', () => {
    const mockIngredientName = mockIngredientsResponse.data[0].name; // Краторная булка N-200i
    cy.get('ul:nth-of-type(1) > li:nth-of-type(1)').as('ingredient-element');
    cy.get('#modals > div').should('not.exist');
    cy.get('@ingredient-element').should('contain', mockIngredientName);
    cy.get('@ingredient-element').click();
    cy.get('#modals > div').should('exist');
    cy.get('#modals > div').should('contain', 'Детали ингредиента');
    cy.get('#modals > div').should('contain', mockIngredientName);
    cy.get('#modals button').click();
    cy.get('#modals > div').should('not.exist');
  });

  it('Закрытие модального окна по overlay', () => {
    cy.get('#modals > div').should('not.exist');
    cy.get('ul:nth-of-type(1) > li:nth-of-type(1)').click();
    cy.get('#modals > div').should('exist');
    cy.get('#modals > div').should('contain', 'Детали ингредиента');
    cy.get('#modals > div:last-child').click({ force: true });
    cy.get('#modals > div').should('not.exist');
  });

  it('Открытие модального окна без модального окна', () => {
    cy.visit('http://localhost:4000/ingredients/643d69a5c3f7b9001cfa093c');
    cy.get('#modals > div').should('not.exist');
    cy.get('#root').should('contain', 'Краторная булка N-200i');
  });

  it('Создание заказа', () => {
    cy.get('ul:nth-of-type(1) > li:first-child > button').click({
      multiple: true
    });
    cy.get('ul:nth-of-type(2) > li:first-child > button').click({
      multiple: true
    });
    cy.get('ul:nth-of-type(3) > li:first-child > button').click({
      multiple: true
    });
    cy.get('#modals > div').should('not.exist');
    cy.get('section:nth-of-type(2) button').click({
      force: true,
      multiple: true
    });
    cy.get('#modals > div').should('exist');
    cy.get('#modals > div h2').should('contain', mockOrderResponse.order.number);
    cy.get('#modals > div:last-child').click({ force: true });
    cy.get('#modals > div').should('not.exist');

    cy.get('section:nth-of-type(2)')
      .find('div:nth-of-type(1)')
      .should('contain', 'Выберите булки');
    cy.get('section:nth-of-type(2)')
      .find('div:nth-of-type(2)')
      .should('contain', 'Выберите булки');
    cy.get('section:nth-of-type(2) > ul div').should(
      'contain',
      'Выберите начинку'
    );
  });
});
