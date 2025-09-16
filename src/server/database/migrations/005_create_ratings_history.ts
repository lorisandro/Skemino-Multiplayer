import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("ratings_history", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("player_id")
      .notNullable()
      .references("id")
      .inTable("players")
      .onDelete("CASCADE");
    table
      .uuid("game_id")
      .references("id")
      .inTable("games")
      .onDelete("SET NULL");
    table.integer("rating_before").notNullable();
    table.integer("rating_after").notNullable();
    table.integer("rating_change").notNullable();
    table.decimal("k_factor", 6, 2).notNullable(); // K-factor used in calculation
    table.decimal("expected_score", 5, 4); // Expected score (0-1)
    table.decimal("actual_score", 3, 1).notNullable(); // Actual score (0, 0.5, 1)
    table.string("skill_level_before", 50);
    table.string("skill_level_after", 50);
    table.enum("game_result", ["win", "draw", "loss"]);
    table.boolean("is_provisional").defaultTo(false); // First 20 games use provisional rating
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Indexes
    table.index("player_id");
    table.index("game_id");
    table.index("created_at");
    table.index(["player_id", "created_at"]); // For player rating history queries
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("ratings_history");
}
