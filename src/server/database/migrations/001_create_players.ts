import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("players", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("username", 30).notNullable().unique();
    table.string("email", 255).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.integer("rating").defaultTo(1000).notNullable();
    table.integer("peak_rating").defaultTo(1000).notNullable();
    table.string("skill_level", 50).defaultTo("Beginner").notNullable();
    table.integer("games_played").defaultTo(0).notNullable();
    table.integer("games_won").defaultTo(0).notNullable();
    table.integer("games_drawn").defaultTo(0).notNullable();
    table.integer("games_lost").defaultTo(0).notNullable();
    table.integer("tournament_points").defaultTo(0).notNullable();
    table.boolean("is_online").defaultTo(false).notNullable();
    table.timestamp("last_seen").defaultTo(knex.fn.now());
    table.string("avatar_url", 500);
    table.string("country_code", 3);
    table.jsonb("preferences").defaultTo("{}");
    table.jsonb("statistics").defaultTo("{}");
    table.boolean("is_verified").defaultTo(false).notNullable();
    table.boolean("is_banned").defaultTo(false).notNullable();
    table.string("ban_reason", 500);
    table.timestamp("banned_until");
    table.timestamps(true, true);

    // Indexes for performance
    table.index("rating");
    table.index("skill_level");
    table.index("is_online");
    table.index("last_seen");
    table.index("created_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("players");
}
