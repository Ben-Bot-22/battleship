/* eslint-disable */
import { createShip } from '../ship';

describe('ship', () => {
  test('hits sink ship', () => {
    const ship = createShip(3);
    ship.hit(0);
    ship.hit(1);
    ship.hit(2);
    expect(ship.isSunk()).toBe(true);
  });
});
