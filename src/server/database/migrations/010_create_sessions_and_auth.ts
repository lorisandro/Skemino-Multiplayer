import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Sessions table for authentication
  await knex.schema.createTable("sessions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("player_id")
      .notNullable()
      .references("id")
      .inTable("players")
      .onDelete("CASCADE");
    table.string("token", 500).notNullable().unique();
    table.string("refresh_token", 500).notNullable().unique();
    table.string("ip_address", 45);
    table.string("user_agent", 500);
    table.jsonb("device_info"); // Browser, OS, etc.
    table.boolean("is_active").defaultTo(true);
    table.timestamp("last_activity").defaultTo(knex.fn.now());
    table.timestamp("expires_at").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Indexes
    table.index("player_id");
    table.index("token");
    table.index("refresh_token");
    table.index("is_active");
    table.index("expires_at");
  });

  // Password reset tokens
  await knex.schema.createTable("password_resets", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("player_id")
      .notNullable()
      .references("id")
      .inTable("players")
      .onDelete("CASCADE");
    table.string("token", 500).notNullable().unique();
    table.boolean("is_used").defaultTo(false);
    table.timestamp("expires_at").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("used_at");

    // Indexes
    table.index("player_id");
    table.index("token");
    table.index("is_used");
    table.index("expires_at");
  });

  // Email verification tokens
  await knex.schema.createTable("email_verifications", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("player_id")
      .notNullable()
      .references("id")
      .inTable("players")
      .onDelete("CASCADE");
    table.string("token", 500).notNullable().unique();
    table.string("email", 255).notNullable(); // The email to verify
    table.boolean("is_verified").defaultTo(false);
    table.timestamp("expires_at").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("verified_at");

    // Indexes
    table.index("player_id");
    table.index("token");
    table.index("is_verified");
    table.index("expires_at");
  });

  // Login attempts tracking (for security)
  await knex.schema.createTable("login_attempts", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("email", 255);
    table.string("username", 30);
    table.string("ip_address", 45).notNullable();
    table.boolean("success").notNullable();
    table.string("failure_reason", 100);
    table.timestamp("attempted_at").defaultTo(knex.fn.now());

    // Indexes
    table.index("email");
    table.index("username");
    table.index("ip_address");
    table.index("success");
    table.index("attempted_at");
    table.index(["ip_address", "attempted_at"]); // For rate limiting queries
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("login_attempts");
  await knex.schema.dropTable("email_verifications");
  await knex.schema.dropTable("password_resets");
  await knex.schema.dropTable("sessions");
}
