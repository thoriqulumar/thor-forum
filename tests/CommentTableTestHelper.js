/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
  async addComment({
    id = 'commentId-123',
    threadId = 'threadId-123',
    content = 'ini adalah content',
    owner = 'ownerId-123',
  }) {
    const query = {
      text: 'INSERT INTO thread_comment VALUES($1, $2, $3, $4)',
      values: [id, owner, threadId, content],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM thread_comment WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comment WHERE 1=1');
  },
};

module.exports = CommentTableTestHelper;
