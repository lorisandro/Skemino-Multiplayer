import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Game analysis table - for post-game analysis
  await knex.schema.createTable("game_analysis", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("game_id")
      .notNullable()
      .references("id")
      .inTable("games")
      .onDelete("CASCADE");
    table.jsonb("opening_analysis"); // Opening phase analysis
    table.jsonb("midgame_analysis"); // Midgame analysis
    table.jsonb("endgame_analysis"); // Endgame analysis
    table.jsonb("critical_moments"); // Key turning points in the game
    table.jsonb("blunders"); // Major mistakes
    table.jsonb("brilliant_moves"); // Exceptional moves
    table.decimal("white_accuracy", 5, 2); // Move accuracy percentage
    table.decimal("black_accuracy", 5, 2);
    table.integer("white_vertex_control_time"); // Time controlling vertices in seconds
    table.integer("black_vertex_control_time");
    table.integer("total_loops_created").defaultTo(0);
    table.integer("total_reversers_played").defaultTo(0);
    table.string("game_complexity", 50); // 'simple', 'moderate', 'complex', 'very_complex'
    table.timestamp("analyzed_at").defaultTo(knex.fn.now());

    // Unique constraint
    table.unique("game_id");

    // Indexes
    table.index("game_id");
    table.index("analyzed_at");
  });

  // Opening book table - for opening theory
  await knex.schema.createTable("opening_book", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name", 100).notNullable();
    table.string("eco_code", 10); // Future: ECO-like classification for Skèmino
    table.text("description");
    table.jsonb("move_sequence").notNullable(); // Array of moves in PSN notation
    table.integer("move_count").notNullable();
    table.integer("popularity").defaultTo(0); // Times played
    table.decimal("white_win_rate", 5, 2);
    table.decimal("draw_rate", 5, 2);
    table.decimal("black_win_rate", 5, 2);
    table.jsonb("variations"); // Common variations
    table.boolean("is_mainline").defaultTo(true);
    table.timestamps(true, true);

    // Indexes
    table.index("name");
    table.index("eco_code");
    table.index("popularity");
    table.index("move_count");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("opening_book");
  await knex.schema.dropTable("game_analysis");
}
