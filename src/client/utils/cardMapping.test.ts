/**
 * Tests for Skèmino Card Mapping Utility
 */

import {
  CARD_IMAGE_MAPPING,
  getCardImagePath,
  getAllCardCodes,
  getCardsBySuit,
  parseCardCode,
  createCardCode,
  isValidCardCode,
  getCardValueDisplayName,
  getCardDisplayName,
  createSkeminoCard,
  getAllCards,
  TOTAL_CARDS,
  CARDS_PER_SUIT,
  SUITS,
  VALUES
} from './cardMapping';

describe('Card Mapping Utility', () => {
  describe('CARD_IMAGE_MAPPING', () => {
    it('should contain exactly 39 cards', () => {
      expect(Object.keys(CARD_IMAGE_MAPPING)).toHaveLength(39);
    });

    it('should contain all Pietra cards (P1-P13)', () => {
      for (let i = 1; i <= 13; i++) {
        const cardCode = `P${i}`;
        expect(CARD_IMAGE_MAPPING).toHaveProperty(cardCode);
        expect(CARD_IMAGE_MAPPING[cardCode as keyof typeof CARD_IMAGE_MAPPING]).toBe(`/img/Carte/P${i}.png`);
      }
    });

    it('should contain all Forbici cards (F1-F13)', () => {
      for (let i = 1; i <= 13; i++) {
        const cardCode = `F${i}`;
        expect(CARD_IMAGE_MAPPING).toHaveProperty(cardCode);
        expect(CARD_IMAGE_MAPPING[cardCode as keyof typeof CARD_IMAGE_MAPPING]).toBe(`/img/Carte/F${i}.png`);
      }
    });

    it('should contain all Carta cards (C1-C13)', () => {
      for (let i = 1; i <= 13; i++) {
        const cardCode = `C${i}`;
        expect(CARD_IMAGE_MAPPING).toHaveProperty(cardCode);
        expect(CARD_IMAGE_MAPPING[cardCode as keyof typeof CARD_IMAGE_MAPPING]).toBe(`/img/Carte/C${i}.png`);
      }
    });
  });

  describe('getCardImagePath', () => {
    it('should return correct path for valid card codes', () => {
      expect(getCardImagePath('P1')).toBe('/img/Carte/P1.png');
      expect(getCardImagePath('F12')).toBe('/img/Carte/F12.png');
      expect(getCardImagePath('C10')).toBe('/img/Carte/C10.png');
    });

    it('should throw error for invalid card codes', () => {
      expect(() => getCardImagePath('X1' as any)).toThrow('Invalid card code: X1');
      expect(() => getCardImagePath('P14' as any)).toThrow('Invalid card code: P14');
      expect(() => getCardImagePath('Z99' as any)).toThrow('Invalid card code: Z99');
    });
  });

  describe('getAllCardCodes', () => {
    it('should return exactly 39 card codes', () => {
      const allCodes = getAllCardCodes();
      expect(allCodes).toHaveLength(39);
    });

    it('should return all valid card codes', () => {
      const allCodes = getAllCardCodes();

      // Check that each suit has 13 cards
      const pietraCards = allCodes.filter(code => code.startsWith('P'));
      const forbiciCards = allCodes.filter(code => code.startsWith('F'));
      const cartaCards = allCodes.filter(code => code.startsWith('C'));

      expect(pietraCards).toHaveLength(13);
      expect(forbiciCards).toHaveLength(13);
      expect(cartaCards).toHaveLength(13);
    });
  });

  describe('getCardsBySuit', () => {
    it('should return 13 cards for each suit', () => {
      expect(getCardsBySuit('P')).toHaveLength(13);
      expect(getCardsBySuit('F')).toHaveLength(13);
      expect(getCardsBySuit('C')).toHaveLength(13);
    });

    it('should return correct cards for Pietra suit', () => {
      const pietraCards = getCardsBySuit('P');
      expect(pietraCards).toContain('P1');
      expect(pietraCards).toContain('P7');
      expect(pietraCards).toContain('P13');
      expect(pietraCards).not.toContain('F1');
      expect(pietraCards).not.toContain('C1');
    });
  });

  describe('parseCardCode', () => {
    it('should correctly parse card codes', () => {
      expect(parseCardCode('P1')).toEqual({ suit: 'P', value: 1 });
      expect(parseCardCode('F12')).toEqual({ suit: 'F', value: 12 });
      expect(parseCardCode('C10')).toEqual({ suit: 'C', value: 10 });
    });
  });

  describe('createCardCode', () => {
    it('should create valid card codes', () => {
      expect(createCardCode('P', 1)).toBe('P1');
      expect(createCardCode('F', 12)).toBe('F12');
      expect(createCardCode('C', 10)).toBe('C10');
    });

    it('should throw error for invalid inputs', () => {
      expect(() => createCardCode('X' as any, 1)).toThrow('Invalid suit: X');
      expect(() => createCardCode('P', 0 as any)).toThrow('Invalid value: 0');
      expect(() => createCardCode('P', 14 as any)).toThrow('Invalid value: 14');
    });
  });

  describe('isValidCardCode', () => {
    it('should return true for valid card codes', () => {
      expect(isValidCardCode('P1')).toBe(true);
      expect(isValidCardCode('F12')).toBe(true);
      expect(isValidCardCode('C10')).toBe(true);
    });

    it('should return false for invalid card codes', () => {
      expect(isValidCardCode('X1')).toBe(false);
      expect(isValidCardCode('P14')).toBe(false);
      expect(isValidCardCode('Z99')).toBe(false);
      expect(isValidCardCode('')).toBe(false);
      expect(isValidCardCode('ABC')).toBe(false);
    });
  });

  describe('getCardValueDisplayName', () => {
    it('should return correct display names for special values', () => {
      expect(getCardValueDisplayName(1)).toBe('A');
      expect(getCardValueDisplayName(11)).toBe('J');
      expect(getCardValueDisplayName(12)).toBe('Q');
      expect(getCardValueDisplayName(13)).toBe('K');
    });

    it('should return string numbers for numeric values', () => {
      expect(getCardValueDisplayName(2)).toBe('2');
      expect(getCardValueDisplayName(5)).toBe('5');
      expect(getCardValueDisplayName(10)).toBe('10');
    });
  });

  describe('getCardDisplayName', () => {
    it('should return correct full display names', () => {
      expect(getCardDisplayName('P1')).toBe('Ace of Pietra');
      expect(getCardDisplayName('F11')).toBe('Jack of Forbici');
      expect(getCardDisplayName('C12')).toBe('Queen of Carta');
      expect(getCardDisplayName('P13')).toBe('King of Pietra');
      expect(getCardDisplayName('F5')).toBe('Five of Forbici');
    });
  });

  describe('createSkeminoCard', () => {
    it('should create complete card objects', () => {
      const card = createSkeminoCard('P1');

      expect(card).toEqual({
        code: 'P1',
        suit: 'P',
        value: 1,
        displayValue: 'A',
        displayName: 'Ace of Pietra',
        imagePath: '/img/Carte/P1.png'
      });
    });

    it('should work for all card types', () => {
      const jackCard = createSkeminoCard('F11');
      expect(jackCard.displayValue).toBe('J');
      expect(jackCard.displayName).toBe('Jack of Forbici');

      const numericCard = createSkeminoCard('C7');
      expect(numericCard.displayValue).toBe('7');
      expect(numericCard.displayName).toBe('Seven of Carta');
    });
  });

  describe('getAllCards', () => {
    it('should return 39 complete card objects', () => {
      const allCards = getAllCards();
      expect(allCards).toHaveLength(39);
    });

    it('should have all properties for each card', () => {
      const allCards = getAllCards();

      allCards.forEach(card => {
        expect(card).toHaveProperty('code');
        expect(card).toHaveProperty('suit');
        expect(card).toHaveProperty('value');
        expect(card).toHaveProperty('displayValue');
        expect(card).toHaveProperty('displayName');
        expect(card).toHaveProperty('imagePath');
        expect(card.imagePath).toMatch(/^\/img\/Carte\/[PFC]\d{1,2}\.png$/);
      });
    });
  });

  describe('Constants', () => {
    it('should have correct constant values', () => {
      expect(TOTAL_CARDS).toBe(39);
      expect(CARDS_PER_SUIT).toBe(13);
      expect(SUITS).toEqual(['P', 'F', 'C']);
      expect(VALUES).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    });
  });
});