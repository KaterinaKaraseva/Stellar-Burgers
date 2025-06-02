import mockOrderResponse from '../fixtures/order.json';
import mockTokenResponse from '../fixtures/token.json';
import mockIngredientsResponse from '../fixtures/ingredients.json';
import { deleteCookie, setCookie } from '../../src/utils/cookie';

// Выносим базовый URL в константу
const testUrl = 'http://localhost:4000';

// Выносим часто используемые селекторы в константы
const BUNS_SELECTOR = 'ul:nth-of-type(1)';
const MAINS_SELECTOR = 'ul:nth-of-type(2)';
const SAUCES_SELECTOR = 'ul:nth-of-type(3)';
const CONSTRUCTOR_SECTION = 'section:nth-of-type(2)';
const MODALS_CONTAINER = '#modals > div';

describe('burgerConstructor', () => {
    // мокаем данные с сервера
    beforeEach(() => {
        setCookie('accessToken', mockTokenResponse.accessToken);
        localStorage.setItem('refreshToken', mockTokenResponse.refreshToken);

        cy.intercept('GET', '/api/auth/token', { fixture: 'token.json' });
        cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
        cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
        cy.intercept('POST', '/api/orders', { fixture: 'order.json' });

        // Используем testUrl для посещения главной страницы
        cy.visit(`${testUrl}/`);
    });

    afterEach(() => {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
    });

    it('Отображение ингредиентов', () => {
        cy.get('h1').should('contain', 'Соберите бургер');
        cy.get('h3:nth-of-type(1)').should('contain', 'Булки');
        cy.get(BUNS_SELECTOR).find('li').should('have.length', 2);
        cy.get('h3:nth-of-type(2)').should('contain', 'Начинки');
        cy.get(MAINS_SELECTOR).find('li').should('have.length', 9);
        cy.get('h3:nth-of-type(3)').should('contain', 'Соусы');
        cy.get(SAUCES_SELECTOR).find('li').should('have.length', 4);
    });

    it('Добавление ингредиентов', () => {
        cy.get(`${BUNS_SELECTOR} > li:first-child > button`).click({
            multiple: true
        });
        cy.get(`${MAINS_SELECTOR} > li:first-child > button`).click({
            multiple: true
        });
        cy.get(`${SAUCES_SELECTOR} > li:first-child > button`).click({
            multiple: true
        });

        cy.get(CONSTRUCTOR_SECTION)
            .find('div:nth-of-type(1)')
            .should('contain', 'Краторная булка N-200i (верх)');
        cy.get(CONSTRUCTOR_SECTION)
            .find('div:nth-of-type(2)')
            .should('contain', 'Краторная булка N-200i (низ)');
        cy.get(`${CONSTRUCTOR_SECTION} > ul`).find('li').should('have.length', 2);
        cy.get(`${CONSTRUCTOR_SECTION} > ul`)
            .find('li:nth-of-type(1)')
            .should('contain', 'Биокотлета из марсианской Магнолии');
        cy.get(`${CONSTRUCTOR_SECTION} > ul`)
            .find('li:nth-of-type(2)')
            .should('contain', 'Соус Spicy-X');
    });

    it('Открытие и закрытие модального окна', () => {
        const mockIngredientName = mockIngredientsResponse.data[0].name; // Краторная булка N-200i
        const firstBunElement = `${BUNS_SELECTOR} > li:nth-of-type(1)`;
        cy.get(firstBunElement).as('ingredient-element');
        cy.get(MODALS_CONTAINER).should('not.exist');
        cy.get('@ingredient-element').should('contain', mockIngredientName);
        cy.get('@ingredient-element').click();
        cy.get(MODALS_CONTAINER).should('exist');
        cy.get(MODALS_CONTAINER).should('contain', 'Детали ингредиента');
        cy.get(MODALS_CONTAINER).should('contain', mockIngredientName);
        cy.get(`${MODALS_CONTAINER} button`).click();
        cy.get(MODALS_CONTAINER).should('not.exist');
    });

    it('Закрытие модального окна по overlay', () => {
        const firstBunElement = `${BUNS_SELECTOR} > li:nth-of-type(1)`;
        cy.get(MODALS_CONTAINER).should('not.exist');
        cy.get(firstBunElement).click();
        cy.get(MODALS_CONTAINER).should('exist');
        cy.get(MODALS_CONTAINER).should('contain', 'Детали ингредиента');
        cy.get(`${MODALS_CONTAINER}:last-child`).click({ force: true });
        cy.get(MODALS_CONTAINER).should('not.exist');
    });

    it('Открытие модального окна без модального окна', () => {
        cy.visit(`${testUrl}/ingredients/643d69a5c3f7b9001cfa093c`);
        cy.get(MODALS_CONTAINER).should('not.exist');
        cy.get('#root').should('contain', 'Краторная булка N-200i');
    });

    it('Создание заказа', () => {
        cy.get(`${BUNS_SELECTOR} > li:first-child > button`).click({
            multiple: true
        });
        cy.get(`${MAINS_SELECTOR} > li:first-child > button`).click({
            multiple: true
        });
        cy.get(`${SAUCES_SELECTOR} > li:first-child > button`).click({
            multiple: true
        });
        cy.get(MODALS_CONTAINER).should('not.exist');
        cy.get(`${CONSTRUCTOR_SECTION} button`).click({
            force: true,
            multiple: true
        });
        cy.get(MODALS_CONTAINER).should('exist');
        cy.get(`${MODALS_CONTAINER} h2`).should('contain', mockOrderResponse.order.number);
        cy.get(`${MODALS_CONTAINER}:last-child`).click({ force: true });
        cy.get(MODALS_CONTAINER).should('not.exist');

        cy.get(CONSTRUCTOR_SECTION)
            .find('div:nth-of-type(1)')
            .should('contain', 'Выберите булки');
        cy.get(CONSTRUCTOR_SECTION)
            .find('div:nth-of-type(2)')
            .should('contain', 'Выберите булки');
        cy.get(`${CONSTRUCTOR_SECTION} > ul div`).should(
            'contain',
            'Выберите начинку'
        );
    });
});
