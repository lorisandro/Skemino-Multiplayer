/**
 * Skèmino Card Mapping Utility
 *
 * Maps card codes to their corresponding image paths for the 39 Chain Cards.
 *
 * Card Code Format:
 * - P = Pietra (Stone)
 * - F = Forbici (Scissors)
 * - C = Carta (Paper)
 * - Numbers 1-13 where:
 *   - 1 = Asso (Ace)
 *   - 2-10 = Numeric values
 *   - 11 = Jack (J)
 *   - 12 = Queen (Q)
 *   - 13 = King (K)
 */

import { CardSuit, CardValue, CardCode, SkeminoCard, CardUtils, CARD_CONSTANTS } from '../../shared/utils/cardTypes';

/**
 * Complete mapping of all 39 Skèmino cards to their image paths
 */
export const CARD_IMAGE_MAPPING: Record<CardCode, string> = {
  // Pietra (Stone) Cards - P1 to P13
  'P1': '/img/Carte/P1.webp',
  'P2': '/img/Carte/P2.webp',
  'P3': '/img/Carte/P3.webp',
  'P4': '/img/Carte/P4.webp',
  'P5': '/img/Carte/P5.webp',
  'P6': '/img/Carte/P6.webp',
  'P7': '/img/Carte/P7.webp',
  'P8': '/img/Carte/P8.webp',
  'P9': '/img/Carte/P9.webp',
  'P10': '/img/Carte/P10.webp',
  'P11': '/img/Carte/P11.webp',
  'P12': '/img/Carte/P12.webp',
  'P13': '/img/Carte/P13.webp',

  // Forbici (Scissors) Cards - F1 to F13
  'F1': '/img/Carte/F1.webp',
  'F2': '/img/Carte/F2.webp',
  'F3': '/img/Carte/F3.webp',
  'F4': '/img/Carte/F4.webp',
  'F5': '/img/Carte/F5.webp',
  'F6': '/img/Carte/F6.webp',
  'F7': '/img/Carte/F7.webp',
  'F8': '/img/Carte/F8.webp',
  'F9': '/img/Carte/F9.webp',
  'F10': '/img/Carte/F10.webp',
  'F11': '/img/Carte/F11.webp',
  'F12': '/img/Carte/F12.webp',
  'F13': '/img/Carte/F13.webp',

  // Carta (Paper) Cards - C1 to C13
  'C1': '/img/Carte/C1.webp',
  'C2': '/img/Carte/C2.webp',
  'C3': '/img/Carte/C3.webp',
  'C4': '/img/Carte/C4.webp',
  'C5': '/img/Carte/C5.webp',
  'C6': '/img/Carte/C6.webp',
  'C7': '/img/Carte/C7.webp',
  'C8': '/img/Carte/C8.webp',
  'C9': '/img/Carte/C9.webp',
  'C10': '/img/Carte/C10.webp',
  'C11': '/img/Carte/C11.webp',
  'C12': '/img/Carte/C12.webp',
  'C13': '/img/Carte/C13.webp',
};

/**
 * Get the image path for a specific card
 * @param cardCode - The card code (e.g., 'P1', 'F12', 'C10')
 * @returns The relative path to the card image
 * @throws Error if card code is invalid
 */
export function getCardImagePath(cardCode: CardCode): string {
  const imagePath = CARD_IMAGE_MAPPING[cardCode];
  if (!imagePath) {
    throw new Error(`Invalid card code: ${cardCode}`);
  }
  return imagePath;
}

/**
 * Get all available card codes
 * @returns Array of all valid card codes
 */
export function getAllCardCodes(): CardCode[] {
  return Object.keys(CARD_IMAGE_MAPPING) as CardCode[];
}

/**
 * Get cards by suit
 * @param suit - The card suit ('P', 'F', or 'C')
 * @returns Array of card codes for the specified suit
 */
export function getCardsBySuit(suit: CardSuit): CardCode[] {
  return getAllCardCodes().filter(code => code.startsWith(suit));
}

/**
 * Parse a card code into suit and value
 * @param cardCode - The card code to parse
 * @returns Object with suit and value properties
 */
export function parseCardCode(cardCode: CardCode): { suit: CardSuit; value: CardValue } {
  return CardUtils.parseCode(cardCode);
}

/**
 * Create a card code from suit and value
 * @param suit - The card suit
 * @param value - The card value (1-13)
 * @returns The formatted card code
 */
export function createCardCode(suit: CardSuit, value: CardValue): CardCode {
  if (!CARD_CONSTANTS.SUITS.includes(suit)) {
    throw new Error(`Invalid suit: ${suit}`);
  }

  if (value < 1 || value > 13) {
    throw new Error(`Invalid value: ${value}. Must be between 1 and 13.`);
  }

  return CardUtils.createCode(suit, value);
}

/**
 * Check if a card code is valid
 * @param cardCode - The card code to validate
 * @returns True if the card code is valid
 */
export function isValidCardCode(cardCode: string): cardCode is CardCode {
  return CardUtils.isValidCardCode(cardCode) && cardCode in CARD_IMAGE_MAPPING;
}

/**
 * Get the display name for a card value
 * @param value - The card value (1-13)
 * @returns The display name (A, 2-10, J, Q, K)
 */
export function getCardValueDisplayName(value: CardValue): string {
  return CardUtils.getDisplayValue(value);
}

/**
 * Get the full display name for a card
 * @param cardCode - The card code
 * @returns The full display name (e.g., "Ace of Stone", "King of Scissors")
 */
export function getCardDisplayName(cardCode: CardCode): string {
  const { suit, value } = CardUtils.parseCode(cardCode);
  const suitInfo = CARD_CONSTANTS.SUIT_INFO[suit];
  const valueName = CardUtils.getValueName(value);

  return `${valueName} of ${suitInfo.name}`;
}

/**
 * Create a complete SkeminoCard object with image path
 * @param cardCode - The card code
 * @returns Complete card object with all properties
 */
export function createSkeminoCard(cardCode: CardCode): SkeminoCard & { imagePath: string } {
  const { suit, value } = CardUtils.parseCode(cardCode);

  return {
    code: cardCode,
    suit,
    value,
    displayValue: CardUtils.getDisplayValue(value),
    displayName: getCardDisplayName(cardCode),
    imagePath: getCardImagePath(cardCode)
  };
}

/**
 * Get all cards as complete SkeminoCard objects with image paths
 * @returns Array of all cards with full information
 */
export function getAllCards(): (SkeminoCard & { imagePath: string })[] {
  return getAllCardCodes().map(createSkeminoCard);
}

/**
 * Constants for easy reference (re-exported from shared types)
 */
export const TOTAL_CARDS = CARD_CONSTANTS.TOTAL_CARDS;
export const CARDS_PER_SUIT = CARD_CONSTANTS.CARDS_PER_SUIT;
export const SUITS = CARD_CONSTANTS.SUITS;
export const VALUES = CARD_CONSTANTS.VALUES;