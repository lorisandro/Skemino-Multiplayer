/**
 * Shared Card Types for Skèmino Game
 *
 * These types are used throughout the application for consistent
 * card representation between client and server.
 */

export type CardSuit = "P" | "F" | "C";
export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type CardCode = `${CardSuit}${CardValue}`;

/**
 * Interface representing a Skèmino card
 */
export interface SkeminoCard {
  /** Card identifier code (e.g., 'P1', 'F12', 'C10') */
  code: CardCode;
  /** Card suit (P=Pietra, F=Forbici, C=Carta) */
  suit: CardSuit;
  /** Card value (1-13, where 1=Ace, 11=Jack, 12=Queen, 13=King) */
  value: CardValue;
  /** Display name for UI (e.g., 'A', '10', 'K') */
  displayValue: string;
  /** Full display name (e.g., 'Ace of Stone') */
  displayName: string;
}

/**
 * Card suit information
 */
export interface CardSuitInfo {
  code: CardSuit;
  name: string;
  symbol: string;
  color: string;
}

/**
 * Rock-Paper-Scissors relationships between suits
 */
export interface SuitRelationship {
  beats: CardSuit;
  beatenBy: CardSuit;
}

/**
 * Constants for card game mechanics
 */
export const CARD_CONSTANTS = {
  TOTAL_CARDS: 39,
  CARDS_PER_SUIT: 13,
  SUITS: ["P", "F", "C"] as const,
  VALUES: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const,

  // Suit information
  SUIT_INFO: {
    P: { code: "P" as const, name: "Pietra", symbol: "🪨", color: "#8B4513" },
    F: { code: "F" as const, name: "Forbici", symbol: "✂️", color: "#C0C0C0" },
    C: { code: "C" as const, name: "Carta", symbol: "📄", color: "#FFFFFF" },
  } as Record<CardSuit, CardSuitInfo>,

  // Rock-Paper-Scissors relationships (Morra Cinese)
  SUIT_RELATIONSHIPS: {
    P: { beats: "F", beatenBy: "C" }, // Pietra beats Forbici, beaten by Carta
    F: { beats: "C", beatenBy: "P" }, // Forbici beats Carta, beaten by Pietra
    C: { beats: "P", beatenBy: "F" }, // Carta beats Pietra, beaten by Forbici
  } as Record<CardSuit, SuitRelationship>,
} as const;

/**
 * Special card values with display names
 */
export const SPECIAL_VALUES = {
  ACE: 1,
  JACK: 11,
  QUEEN: 12,
  KING: 13,
} as const;

/**
 * Utility functions for card operations
 */
export const CardUtils = {
  /**
   * Get display value for a card number
   */
  getDisplayValue(value: CardValue): string {
    switch (value) {
      case 1:
        return "A";
      case 11:
        return "J";
      case 12:
        return "Q";
      case 13:
        return "K";
      default:
        return value.toString();
    }
  },

  /**
   * Get full display name for a card value
   */
  getValueName(value: CardValue): string {
    const names: Record<CardValue, string> = {
      1: "Ace",
      2: "Two",
      3: "Three",
      4: "Four",
      5: "Five",
      6: "Six",
      7: "Seven",
      8: "Eight",
      9: "Nine",
      10: "Ten",
      11: "Jack",
      12: "Queen",
      13: "King",
    };
    return names[value];
  },

  /**
   * Parse card code into components
   */
  parseCode(cardCode: CardCode): { suit: CardSuit; value: CardValue } {
    const suit = cardCode[0] as CardSuit;
    const value = parseInt(cardCode.slice(1)) as CardValue;
    return { suit, value };
  },

  /**
   * Create card code from suit and value
   */
  createCode(suit: CardSuit, value: CardValue): CardCode {
    return `${suit}${value}` as CardCode;
  },

  /**
   * Check if one suit beats another (Morra Cinese rules)
   */
  suitBeats(suit1: CardSuit, suit2: CardSuit): boolean {
    return CARD_CONSTANTS.SUIT_RELATIONSHIPS[suit1].beats === suit2;
  },

  /**
   * Compare two cards by suit relationship and value
   */
  compareCards(
    card1: CardCode,
    card2: CardCode,
  ): {
    winner: CardCode | null;
    reason: "suit" | "value" | "tie";
  } {
    const { suit: suit1, value: value1 } = CardUtils.parseCode(card1);
    const { suit: suit2, value: value2 } = CardUtils.parseCode(card2);

    // First check suit relationship (Morra Cinese)
    if (CardUtils.suitBeats(suit1, suit2)) {
      return { winner: card1, reason: "suit" };
    }
    if (CardUtils.suitBeats(suit2, suit1)) {
      return { winner: card2, reason: "suit" };
    }

    // Same suit, compare by value
    if (value1 > value2) {
      return { winner: card1, reason: "value" };
    }
    if (value2 > value1) {
      return { winner: card2, reason: "value" };
    }

    // Exact same card (shouldn't happen in normal game)
    return { winner: null, reason: "tie" };
  },

  /**
   * Validate if a string is a valid card code
   */
  isValidCardCode(code: string): code is CardCode {
    if (code.length < 2 || code.length > 3) return false;

    const suit = code[0] as CardSuit;
    const valueStr = code.slice(1);
    const value = parseInt(valueStr);

    return (
      CARD_CONSTANTS.SUITS.includes(suit) &&
      !isNaN(value) &&
      value >= 1 &&
      value <= 13 &&
      valueStr === value.toString()
    );
  },
} as const;
