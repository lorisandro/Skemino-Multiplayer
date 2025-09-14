import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Friendships table
  await knex.schema.createTable('friendships', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('requester_id').notNullable().references('id').inTable('players').onDelete('CASCADE');
    table.uuid('addressee_id').notNullable().references('id').inTable('players').onDelete('CASCADE');
    table.enum('status', ['pending', 'accepted', 'declined', 'blocked']).defaultTo('pending');
    table.timestamp('requested_at').defaultTo(knex.fn.now());
    table.timestamp('responded_at');

    // Unique constraint - can't have duplicate friend requests
    table.unique(['requester_id', 'addressee_id']);

    // Indexes
    table.index('requester_id');
    table.index('addressee_id');
    table.index('status');
  });

  // Blocks table - for blocking players
  await knex.schema.createTable('player_blocks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('blocker_id').notNullable().references('id').inTable('players').onDelete('CASCADE');
    table.uuid('blocked_id').notNullable().references('id').inTable('players').onDelete('CASCADE');
    table.string('reason', 500);
    table.timestamp('blocked_at').defaultTo(knex.fn.now());

    // Unique constraint
    table.unique(['blocker_id', 'blocked_id']);

    // Indexes
    table.index('blocker_id');
    table.index('blocked_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('player_blocks');
  await knex.schema.dropTable('friendships');
}