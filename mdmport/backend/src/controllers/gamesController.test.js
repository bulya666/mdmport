const gamesController = require('./gamesController.js');
const Game = require('../models/Game.js');

// Mockoljuk a Game modellt (hogy ne menjen ténylegesen adatbázishoz)
jest.mock('../models/Game');

describe('Games Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    // Minden teszt előtt tiszta request/response objektumok
    mockRequest = {
      query: {},
      params: {},
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getGames - sikeresen visszaadja az összes játékot', async () => {
    // Mock adat
    const mockGames = [
      { id: 1, title: 'Super Mario', price: 19.99 },
      { id: 2, title: 'Zelda', price: 49.99 },
    ];

    Game.getAll.mockResolvedValue(mockGames);

    await gamesController.getGames(mockRequest, mockResponse);

    expect(Game.getAll).toHaveBeenCalledWith({});
    expect(mockResponse.json).toHaveBeenCalledWith(mockGames);
  });

  test('getGames - hibakezelés ha a modell hibát dob', async () => {
    Game.getAll.mockRejectedValue(new Error('Adatbázis hiba'));

    await gamesController.getGames(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'DB error' });
  });

  test('getGameById - érvénytelen ID esetén 400', async () => {
    mockRequest.params = { id: 'nem_szam' };

    await gamesController.getGameById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid ID' });
  });

  test('getGameById - nem található játék -> 404', async () => {
    mockRequest.params = { id: '5' };
    Game.getById.mockResolvedValue(null);

    await gamesController.getGameById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Not found' });
  });
});