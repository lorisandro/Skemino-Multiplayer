import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Leaderboards table - for different time periods and categories
  await knex.schema.createTable("leaderboards", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("player_id")
      .notNullable()
      .references("id")
      .inTable("players")
      .onDelete("CASCADE");
    table
      .enum("period", ["daily", "weekly", "monthly", "yearly", "all_time"])
      .notNullable();
    table
      .enum("category", [
        "rating",
        "games_won",
        "win_streak",
        "tournament_points",
        "bullet",
        "blitz",
        "rapid",
        "classical",
      ])
      .notNullable();
    table.integer("rank").notNullable();
    table.integer("score").notNullable(); // The actual score (rating, wins, etc.)
    table.integer("games_played").defaultTo(0);
    table.decimal("win_rate", 5, 2); // Win percentage
    table.date("period_start").notNullable();
    table.date("period_end").notNullable();
    table.timestamp("calculated_at").defaultTo(knex.fn.now());

    // Unique constraint - one entry per player per period per category
    table.unique(["player_id", "period", "category", "period_start"]);

    // Indexes
    table.index("player_id");
    table.index("period");
    table.index("category");
    table.index("rank");
    table.index(["period", "category", "rank"]); // For leaderboard queries
    table.index("period_start");
  });

  // Achievements table
  await knex.schema.createTable("achievements", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("code", 50).notNullable().unique(); // e.g., 'first_win', 'grandmaster', '100_games'
    table.string("name", 100).notNullable();
    table.text("description").notNullable();
    table.string("icon_url", 500);
    table
      .enum("category", ["gameplay", "social", "competitive", "special"])
      .notNullable();
    table
      .enum("rarity", ["common", "uncommon", "rare", "epic", "legendary"])
      .notNullable();
    table.integer("points").defaultTo(0); // Achievement points
    table.jsonb("requirements"); // Conditions to unlock
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);

    // Indexes
    table.index("category");
    table.index("rarity");
    table.index("is_active");
  });

  // Player achievements
  await knex.schema.createTable("player_achievements", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("player_id")
      .notNullable()
      .references("id")
      .inTable("players")
      .onDelete("CASCADE");
    table
      .uuid("achievement_id")
      .notNullable()
      .references("id")
      .inTable("achievements")
      .onDelete("CASCADE");
    table.timestamp("unlocked_at").defaultTo(knex.fn.now());
    table.jsonb("progress"); // For progressive achievements

    // Unique constraint
    table.unique(["player_id", "achievement_id"]);

    // Indexes
    table.index("player_id");
    table.index("achievement_id");
    table.index("unlocked_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("player_achievements");
  await knex.schema.dropTable("achievements");
  await knex.schema.dropTable("leaderboards");
}
