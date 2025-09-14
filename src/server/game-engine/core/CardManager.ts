import { Card, CardSuit, CardValue } from '../../../shared/types/GameTypes';
import { v4 as uuidv4 } from 'uuid';

export class CardManager {
  private allCards: Card[];
  private deck: Card[];

  constructor() {
    this.allCards = this.createFullDeck();
    this.deck = [...this.allCards];
  }

  private createFullDeck(): Card[] {
    const cards: Card[] = [];
    const suits: CardSuit[] = ['P', 'F', 'C']; // Pietra, Forbici, Carta
    const values: CardValue[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    const suitNames = {
      'P': 'Pietra',
      'F': 'Forbici',
      'C': 'Carta'
    };

    const valueNames = {
      '1': 'Asso',
      '2': 'Due',
      '3': 'Tre',
      '4': 'Quattro',
      '5': 'Cinque',
      '6': 'Sei',
      '7': 'Sette',
      '8': 'Otto',
      '9': 'Nove',
      '10': 'Dieci',
      'J': 'Jack',
      'Q': 'Regina',
      'K': 'Re'
    };

    for (const suit of suits) {
      for (const value of values) {
        cards.push({
          id: `${suit}${value}`,
          suit,
          value,
          displayName: `${valueNames[value]} di ${suitNames[suit]}`
        });
      }
    }

    return cards; // Total: 39 cards (13 x 3)
  }

  public shuffleDeck(): void {
    // Fisher-Yates shuffle algorithm
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  public resetDeck(): void {
    this.deck = [...this.allCards];
    this.shuffleDeck();
  }

  public drawCards(count: number): Card[] {
    if (count > this.deck.length) {
      throw new Error(`Cannot draw ${count} cards, only ${this.deck.length} remaining`);
    }

    const drawnCards: Card[] = [];
    for (let i = 0; i < count; i++) {
      const card = this.deck.pop();
      if (card) {
        drawnCards.push(card);
      }
    }

    return drawnCards;
  }

  public shuffleAndDeal(): Card[] {
    // For Skèmino, each player gets half the deck (approximately)
    // In a standard game, each player would get 19-20 cards
    this.resetDeck();
    return this.drawCards(19); // Each player gets 19 cards, 1 card remains
  }

  public getCard(suit: CardSuit, value: CardValue): Card | undefined {
    return this.allCards.find(c => c.suit === suit && c.value === value);
  }

  public getRemainingCards(): number {
    return this.deck.length;
  }

  public getAllCards(): Card[] {
    return [...this.allCards];
  }

  // Compare two cards according to Skèmino rules
  public compareCards(attacker: Card, defender: Card): 'win' | 'lose' | 'equal' {
    // Different suits - apply Morra Cinese rules
    if (attacker.suit !== defender.suit) {
      const winConditions: Record<CardSuit, CardSuit> = {
        'P': 'F', // Pietra beats Forbici
        'F': 'C', // Forbici beats Carta
        'C': 'P'  // Carta beats Pietra
      };

      if (winConditions[attacker.suit] === defender.suit) {
        return 'win';
      } else {
        return 'lose';
      }
    }

    // Same suit - compare numeric values
    const attackerValue = this.getNumericValue(attacker.value);
    const defenderValue = this.getNumericValue(defender.value);

    // Special case: Ace beats King
    if (attacker.value === '1' && defender.value === 'K') {
      return 'win';
    }
    if (attacker.value === 'K' && defender.value === '1') {
      return 'lose';
    }

    if (attackerValue > defenderValue) {
      return 'win';
    } else if (attackerValue < defenderValue) {
      return 'lose';
    } else {
      return 'equal';
    }
  }

  private getNumericValue(value: CardValue): number {
    const values: Record<CardValue, number> = {
      '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
      '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
    };
    return values[value];
  }

  // Check if three cards form a valid symbolic loop
  public isSymbolicLoop(cards: Card[]): boolean {
    if (cards.length < 3) return false;

    const suits = new Set(cards.map(c => c.suit));
    return suits.size >= 3; // At least 3 different symbols
  }

  // Check if cards form a numeric loop (Ace + King + another)
  public isNumericLoop(cards: Card[]): boolean {
    if (cards.length < 3) return false;

    const hasAce = cards.some(c => c.value === '1');
    const hasKing = cards.some(c => c.value === 'K');

    if (!hasAce || !hasKing) return false;

    // Check if Ace and King are same suit
    const aceCard = cards.find(c => c.value === '1');
    const kingCard = cards.find(c => c.value === 'K');

    if (!aceCard || !kingCard) return false;

    return aceCard.suit === kingCard.suit && cards.length >= 3;
  }

  // Calculate card point value for scoring
  public getCardPoints(card: Card): number {
    return this.getNumericValue(card.value);
  }

  // Get total points for a set of cards
  public getTotalPoints(cards: Card[]): number {
    return cards.reduce((total, card) => total + this.getCardPoints(card), 0);
  }

  // Validate card notation (for PSN)
  public parseCardNotation(notation: string): Card | null {
    // Format: C4, P13, FK, etc.
    const match = notation.match(/^([CFP])([1-9]|10|[JQK])$/);
    if (!match) return null;

    const suit = match[1] as CardSuit;
    const value = match[2] as CardValue;

    return this.getCard(suit, value) || null;
  }

  // Convert card to PSN notation
  public toNotation(card: Card): string {
    return `${card.suit}${card.value}`;
  }
}