exports.up = (pgm) => {
  pgm.createTable('likes_comment', {
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'likes_comment',
    'fk_likes_comment.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'likes_comment',
    'fk_likes_comment.thread_id_thread.id',
    'FOREIGN KEY(thread_id) REFERENCES thread(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'likes_comment',
    'fk_likes_comment.comment_id_thread_comment.id',
    'FOREIGN KEY(comment_id) REFERENCES thread_comment(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comment');
};
