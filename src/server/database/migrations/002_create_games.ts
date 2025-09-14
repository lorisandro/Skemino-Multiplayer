import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('games', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('white_player_id').notNullable().references('id').inTable('players');
    table.uuid('black_player_id').notNullable().references('id').inTable('players');
    table.enum('result', ['1-0', '0-1', '1/2-1/2', '*']).defaultTo('*').notNullable();
    table.enum('termination', [
      'normal',
      'time',
      'resignation',
      'abandonment',
      'rules_infraction',
      'agreed_draw',
      'stalemate',
      'era1_vertex',
      'era2_saturation',
      'era3_exhaustion',
      'era4_reverser'
    ]).notNullable();
    table.string('time_control', 50).notNullable(); // e.g., "300+5" (5 min + 5 sec increment)
    table.integer('white_time_remaining'); // in seconds
    table.integer('black_time_remaining'); // in seconds
    table.integer('white_rating_before').notNullable();
    table.integer('black_rating_before').notNullable();
    table.integer('white_rating_after');
    table.integer('black_rating_after');
    table.integer('white_rating_change');
    table.integer('black_rating_change');
    table.text('psn_notation'); // Full PSN game notation
    table.jsonb('final_position'); // Final board state
    table.integer('move_count').defaultTo(0);
    table.integer('duration'); // Game duration in seconds
    table.boolean('is_rated').defaultTo(true).notNullable();
    table.boolean('is_tournament').defaultTo(false).notNullable();
    table.uuid('tournament_id');
    table.string('opening_name', 100); // Future: opening classification
    table.jsonb('analysis'); // Future: computer analysis
    table.timestamp('started_at').notNullable();
    table.timestamp('ended_at');
    table.timestamps(true, true);

    // Indexes for performance
    table.index('white_player_id');
    table.index('black_player_id');
    table.index('result');
    table.index('is_rated');
    table.index('is_tournament');
    table.index('tournament_id');
    table.index('started_at');
    table.index('created_at');
    table.index(['white_player_id', 'black_player_id']); // For head-to-head queries
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('games');
}