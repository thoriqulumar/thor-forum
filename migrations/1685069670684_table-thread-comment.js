/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('thread_comment', {
    id: {
      type: 'VARCHAR(50)',
      notNull: true,
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    content: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    is_deleted: {
      type: 'boolean',
      default: false,
    },
  });

  pgm.addConstraint(
    'thread_comment',
    'fk_thread_comment.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'thread_comment',
    'fk_thread_comment.thread_id_thread.id',
    'FOREIGN KEY(thread_id) REFERENCES thread(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comment');
};
