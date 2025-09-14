import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Chat messages during games
  await knex.schema.createTable('game_chat', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('game_id').notNullable().references('id').inTable('games').onDelete('CASCADE');
    table.uuid('player_id').notNullable().references('id').inTable('players').onDelete('CASCADE');
    table.text('message').notNullable();
    table.enum('type', ['chat', 'system', 'draw_offer', 'draw_accept', 'draw_decline', 'resignation']);
    table.timestamp('sent_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('game_id');
    table.index('player_id');
    table.index('sent_at');
  });

  // Private messages between players
  await knex.schema.createTable('private_messages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('sender_id').notNullable().references('id').inTable('players').onDelete('CASCADE');
    table.uuid('recipient_id').notNullable().references('id').inTable('players').onDelete('CASCADE');
    table.text('message').notNullable();
    table.boolean('is_read').defaultTo(false);
    table.timestamp('sent_at').defaultTo(knex.fn.now());
    table.timestamp('read_at');

    // Indexes
    table.index('sender_id');
    table.index('recipient_id');
    table.index('is_read');
    table.index('sent_at');
    table.index(['recipient_id', 'is_read']); // For unread messages queries
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('private_messages');
  await knex.schema.dropTable('game_chat');
}