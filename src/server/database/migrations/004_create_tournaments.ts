import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tournaments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 200).notNullable();
    table.text('description');
    table.enum('type', [
      'swiss',
      'round_robin',
      'single_elimination',
      'double_elimination',
      'arena',
      'custom'
    ]).notNullable();
    table.enum('status', [
      'upcoming',
      'registration_open',
      'registration_closed',
      'in_progress',
      'completed',
      'cancelled'
    ]).notNullable();
    table.string('time_control', 50).notNullable();
    table.integer('max_players').notNullable();
    table.integer('min_players').defaultTo(2);
    table.integer('current_players').defaultTo(0);
    table.integer('rounds_total');
    table.integer('current_round').defaultTo(0);
    table.integer('min_rating');
    table.integer('max_rating');
    table.decimal('entry_fee', 10, 2).defaultTo(0);
    table.jsonb('prize_pool'); // Prize distribution structure
    table.uuid('winner_id').references('id').inTable('players');
    table.uuid('runner_up_id').references('id').inTable('players');
    table.jsonb('settings'); // Tournament-specific settings
    table.timestamp('registration_opens_at');
    table.timestamp('registration_closes_at');
    table.timestamp('starts_at').notNullable();
    table.timestamp('ends_at');
    table.uuid('created_by').references('id').inTable('players');
    table.timestamps(true, true);

    // Indexes
    table.index('status');
    table.index('type');
    table.index('starts_at');
    table.index('current_players');
  });

  // Tournament participants
  await knex.schema.createTable('tournament_players', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('tournament_id').notNullable().references('id').inTable('tournaments').onDelete('CASCADE');
    table.uuid('player_id').notNullable().references('id').inTable('players');
    table.integer('seed_number');
    table.decimal('score', 5, 1).defaultTo(0); // Tournament score (wins = 1, draws = 0.5)
    table.integer('games_played').defaultTo(0);
    table.integer('games_won').defaultTo(0);
    table.integer('games_drawn').defaultTo(0);
    table.integer('games_lost').defaultTo(0);
    table.integer('buchholz_score'); // Tiebreak score
    table.integer('sonneborn_berger_score'); // Another tiebreak
    table.integer('final_position');
    table.enum('status', ['registered', 'active', 'eliminated', 'withdrawn', 'disqualified']).defaultTo('registered');
    table.timestamp('registered_at').defaultTo(knex.fn.now());
    table.timestamp('eliminated_at');

    // Unique constraint - player can only register once per tournament
    table.unique(['tournament_id', 'player_id']);

    // Indexes
    table.index('tournament_id');
    table.index('player_id');
    table.index('score');
    table.index('status');
  });

  // Tournament rounds
  await knex.schema.createTable('tournament_rounds', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('tournament_id').notNullable().references('id').inTable('tournaments').onDelete('CASCADE');
    table.integer('round_number').notNullable();
    table.enum('status', ['upcoming', 'in_progress', 'completed']).defaultTo('upcoming');
    table.jsonb('pairings'); // Array of game IDs and player pairings
    table.timestamp('starts_at');
    table.timestamp('ends_at');

    // Unique constraint
    table.unique(['tournament_id', 'round_number']);

    // Indexes
    table.index('tournament_id');
    table.index('round_number');
    table.index('status');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tournament_rounds');
  await knex.schema.dropTable('tournament_players');
  await knex.schema.dropTable('tournaments');
}