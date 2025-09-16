/**
 * ELO Rating Calculator for Skèmino
 * Implements the enhanced ELO formula with dynamic K-factor
 * Formula: EA = 1/(1 + 10^((RB-RA)/(K²-K)))
 * Dynamic K-factor: k = 160 * e^(-R̄/721.35)
 */

import { logger } from "../../utils/logger";

export interface ELORating {
  current: number;
  previous: number;
  change: number;
  kFactor: number;
  games: number;
}

export interface ELOMatchResult {
  whiteRating: ELORating;
  blackRating: ELORating;
  matchBalance: number; // Expected score for white (0.5 = balanced)
}

export class ELOCalculator {
  // Constants for Skèmino ELO system
  private static readonly BASE_K_FACTOR = 160;
  private static readonly K_DECAY_CONSTANT = 721.35;
  private static readonly MIN_K_FACTOR = 10;
  private static readonly MAX_K_FACTOR = 50;

  // Rating thresholds for different K-factors
  private static readonly PROVISIONAL_GAMES = 20; // Games before rating stabilizes
  private static readonly PROVISIONAL_K = 40;
  private static readonly EXPERT_THRESHOLD = 2200;
  private static readonly MASTER_THRESHOLD = 2400;

  /**
   * Calculate dynamic K-factor based on rating and games played
   * Uses the formula: k = 160 * e^(-R̄/721.35)
   * With adjustments for provisional players and high-rated players
   */
  public static calculateKFactor(
    rating: number,
    gamesPlayed: number = 0,
  ): number {
    // Provisional players (< 20 games) use higher K-factor
    if (gamesPlayed < this.PROVISIONAL_GAMES) {
      return this.PROVISIONAL_K;
    }

    // Calculate base K-factor using exponential decay
    const baseK =
      this.BASE_K_FACTOR * Math.exp(-rating / this.K_DECAY_CONSTANT);

    // Apply bounds
    let kFactor = Math.max(
      this.MIN_K_FACTOR,
      Math.min(this.MAX_K_FACTOR, baseK),
    );

    // Reduce K-factor for very high-rated players to increase stability
    if (rating >= this.MASTER_THRESHOLD) {
      kFactor = Math.max(this.MIN_K_FACTOR, kFactor * 0.5);
    } else if (rating >= this.EXPERT_THRESHOLD) {
      kFactor = Math.max(this.MIN_K_FACTOR, kFactor * 0.75);
    }

    return Math.round(kFactor);
  }

  /**
   * Calculate expected score using enhanced Skèmino formula
   * EA = 1/(1 + 10^((RB-RA)/(K²-K)))
   */
  public static calculateExpectedScore(
    playerRating: number,
    opponentRating: number,
    kFactor: number,
  ): number {
    const ratingDifference = opponentRating - playerRating;
    const denominator = kFactor * kFactor - kFactor;

    // Avoid division by zero
    if (denominator === 0) {
      return 0.5; // Equal expected score if K-factor is 1 or 0
    }

    const exponent = ratingDifference / denominator;
    const expectedScore = 1 / (1 + Math.pow(10, exponent));

    return Math.max(0, Math.min(1, expectedScore)); // Clamp between 0 and 1
  }

  /**
   * Calculate new rating after a game
   * @param currentRating Current player rating
   * @param opponentRating Opponent's rating
   * @param actualScore Actual game result (1 = win, 0.5 = draw, 0 = loss)
   * @param gamesPlayed Number of games played (for K-factor calculation)
   * @returns New rating
   */
  public static calculateNewRating(
    currentRating: number,
    opponentRating: number,
    actualScore: number,
    gamesPlayed: number = 0,
  ): number {
    const kFactor = this.calculateKFactor(currentRating, gamesPlayed);
    const expectedScore = this.calculateExpectedScore(
      currentRating,
      opponentRating,
      kFactor,
    );
    const ratingChange = kFactor * (actualScore - expectedScore);

    const newRating = currentRating + ratingChange;

    // Ensure minimum rating of 100
    return Math.max(100, Math.round(newRating));
  }

  /**
   * Calculate rating changes for both players in a match
   */
  public static calculateMatchRatings(
    whiteRating: number,
    blackRating: number,
    result: "1-0" | "0-1" | "1/2-1/2",
    whiteGames: number = 0,
    blackGames: number = 0,
  ): ELOMatchResult {
    // Convert result to scores
    let whiteScore: number, blackScore: number;

    switch (result) {
      case "1-0":
        whiteScore = 1;
        blackScore = 0;
        break;
      case "0-1":
        whiteScore = 0;
        blackScore = 1;
        break;
      case "1/2-1/2":
        whiteScore = 0.5;
        blackScore = 0.5;
        break;
      default:
        throw new Error(`Invalid game result: ${result}`);
    }

    // Calculate K-factors
    const whiteKFactor = this.calculateKFactor(whiteRating, whiteGames);
    const blackKFactor = this.calculateKFactor(blackRating, blackGames);

    // Calculate expected scores
    const whiteExpected = this.calculateExpectedScore(
      whiteRating,
      blackRating,
      whiteKFactor,
    );
    const blackExpected = this.calculateExpectedScore(
      blackRating,
      whiteRating,
      blackKFactor,
    );

    // Calculate rating changes
    const whiteChange = whiteKFactor * (whiteScore - whiteExpected);
    const blackChange = blackKFactor * (blackScore - blackExpected);

    // Calculate new ratings
    const newWhiteRating = Math.max(100, Math.round(whiteRating + whiteChange));
    const newBlackRating = Math.max(100, Math.round(blackRating + blackChange));

    return {
      whiteRating: {
        current: newWhiteRating,
        previous: whiteRating,
        change: Math.round(whiteChange),
        kFactor: whiteKFactor,
        games: whiteGames + 1,
      },
      blackRating: {
        current: newBlackRating,
        previous: blackRating,
        change: Math.round(blackChange),
        kFactor: blackKFactor,
        games: blackGames + 1,
      },
      matchBalance: whiteExpected,
    };
  }

  /**
   * Calculate rating reliability based on games played and rating stability
   */
  public static calculateRatingReliability(
    rating: number,
    gamesPlayed: number,
  ): number {
    if (gamesPlayed < this.PROVISIONAL_GAMES) {
      return gamesPlayed / this.PROVISIONAL_GAMES;
    }

    // Base reliability from games played
    let reliability = Math.min(1, gamesPlayed / 100); // 100 games for max reliability

    // Adjust for rating level (higher ratings are more stable)
    if (rating >= this.MASTER_THRESHOLD) {
      reliability = Math.min(1, reliability + 0.1);
    } else if (rating >= this.EXPERT_THRESHOLD) {
      reliability = Math.min(1, reliability + 0.05);
    }

    return Math.round(reliability * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Get skill level based on rating
   */
  public static getSkillLevel(rating: number): {
    level: string;
    tier: number;
    description: string;
    ratingRange: { min: number; max: number };
  } {
    const levels = [
      {
        level: "Beginner",
        tier: 1,
        description: "Learning the basics",
        min: 100,
        max: 1199,
      },
      {
        level: "Novice",
        tier: 2,
        description: "Understanding fundamentals",
        min: 1200,
        max: 1399,
      },
      {
        level: "Intermediate",
        tier: 3,
        description: "Developing strategy",
        min: 1400,
        max: 1599,
      },
      {
        level: "Advanced",
        tier: 4,
        description: "Strong tactical play",
        min: 1600,
        max: 1799,
      },
      {
        level: "Expert",
        tier: 5,
        description: "Highly skilled",
        min: 1800,
        max: 1999,
      },
      {
        level: "Master",
        tier: 6,
        description: "Tournament level",
        min: 2000,
        max: 2199,
      },
      {
        level: "International Master",
        tier: 7,
        description: "Elite player",
        min: 2200,
        max: 2399,
      },
      {
        level: "Grand Master",
        tier: 8,
        description: "World-class",
        min: 2400,
        max: 2599,
      },
      {
        level: "Super Grand Master",
        tier: 9,
        description: "Among the best",
        min: 2600,
        max: 2799,
      },
      {
        level: "World Champion Level",
        tier: 10,
        description: "Legendary",
        min: 2800,
        max: 3000,
      },
    ];

    for (const skillLevel of levels) {
      if (rating >= skillLevel.min && rating <= skillLevel.max) {
        return {
          ...skillLevel,
          ratingRange: { min: skillLevel.min, max: skillLevel.max },
        };
      }
    }

    // Handle edge cases
    if (rating < 100) {
      return {
        level: "Unrated",
        tier: 0,
        description: "New player",
        ratingRange: { min: 0, max: 99 },
      };
    }

    // Super high rating
    return {
      level: "Legendary",
      tier: 11,
      description: "Beyond classification",
      ratingRange: { min: 3000, max: 9999 },
    };
  }

  /**
   * Calculate tournament pairing strength
   * Used for determining optimal pairings in tournaments
   */
  public static calculatePairingStrength(
    player1Rating: number,
    player2Rating: number,
    player1Games: number = 0,
    player2Games: number = 0,
  ): {
    ratingDifference: number;
    expectedBalance: number;
    pairingQuality: "Excellent" | "Good" | "Fair" | "Poor";
    competitiveness: number; // 0-100 scale
  } {
    const ratingDifference = Math.abs(player1Rating - player2Rating);
    const avgRating = (player1Rating + player2Rating) / 2;
    const kFactor = this.calculateKFactor(
      avgRating,
      Math.max(player1Games, player2Games),
    );

    const expectedBalance = this.calculateExpectedScore(
      player1Rating,
      player2Rating,
      kFactor,
    );
    const balance = Math.abs(expectedBalance - 0.5);

    // Determine pairing quality
    let pairingQuality: "Excellent" | "Good" | "Fair" | "Poor";
    let competitiveness: number;

    if (balance <= 0.1) {
      pairingQuality = "Excellent";
      competitiveness = 95 - balance * 50;
    } else if (balance <= 0.2) {
      pairingQuality = "Good";
      competitiveness = 80 - balance * 50;
    } else if (balance <= 0.3) {
      pairingQuality = "Fair";
      competitiveness = 60 - balance * 50;
    } else {
      pairingQuality = "Poor";
      competitiveness = Math.max(10, 40 - balance * 50);
    }

    return {
      ratingDifference,
      expectedBalance,
      pairingQuality,
      competitiveness: Math.round(competitiveness),
    };
  }

  /**
   * Performance rating calculation
   * Calculates what rating a player performed at based on opponents and results
   */
  public static calculatePerformanceRating(
    games: Array<{ opponentRating: number; result: number; kFactor?: number }>,
  ): number {
    if (games.length === 0) return 1200; // Default starting rating

    const totalScore = games.reduce((sum, game) => sum + game.result, 0);
    const averageOpponentRating =
      games.reduce((sum, game) => sum + game.opponentRating, 0) / games.length;
    const scorePercentage = totalScore / games.length;

    // Performance rating approximation
    let performanceRating: number;

    if (scorePercentage === 1) {
      // Perfect score
      performanceRating = averageOpponentRating + 400;
    } else if (scorePercentage === 0) {
      // Zero score
      performanceRating = averageOpponentRating - 400;
    } else {
      // Calculate based on score percentage
      const logOdds = Math.log10(scorePercentage / (1 - scorePercentage));
      performanceRating = averageOpponentRating + 400 * logOdds;
    }

    return Math.round(Math.max(100, performanceRating));
  }

  /**
   * Logger helper for rating changes
   */
  public static logRatingChange(
    playerName: string,
    oldRating: number,
    newRating: number,
    opponentName: string,
    opponentRating: number,
    result: string,
  ): void {
    const change = newRating - oldRating;
    const changeStr = change > 0 ? `+${change}` : `${change}`;

    logger.info(
      `📊 Rating Update: ${playerName} ${oldRating} → ${newRating} (${changeStr}) ` +
        `vs ${opponentName} (${opponentRating}) Result: ${result}`,
    );
  }
}
