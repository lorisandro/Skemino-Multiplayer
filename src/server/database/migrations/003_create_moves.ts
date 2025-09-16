import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("moves", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("game_id")
      .notNullable()
      .references("id")
      .inTable("games")
      .onDelete("CASCADE");
    table.integer("turn_number").notNullable();
    table.enum("player_color", ["white", "black"]).notNullable();
    table.string("card_notation", 10).notNullable(); // e.g., "P4", "FK", "C1"
    table.string("from_position", 2); // For future: if we add hand position tracking
    table.string("to_position", 2).notNullable(); // e.g., "d3", "a1"
    table.string("captured_card", 10); // Card that was captured, if any
    table.boolean("is_vertex_control").defaultTo(false);
    table.boolean("is_loop_trigger").defaultTo(false);
    table.boolean("is_reverser").defaultTo(false);
    table.boolean("is_check").defaultTo(false);
    table.string("psn_notation", 20).notNullable(); // e.g., "P4:d3*#"
    table.integer("think_time_ms"); // Time taken for this move in milliseconds
    table.jsonb("board_after"); // Board state after this move
    table.timestamp("played_at").defaultTo(knex.fn.now());

    // Composite primary key alternative (if we remove UUID)
    // table.primary(['game_id', 'turn_number']);

    // Indexes
    table.index("game_id");
    table.index("turn_number");
    table.index(["game_id", "turn_number"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("moves");
}
