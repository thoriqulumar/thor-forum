/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeTableTestHelper = {
  async addLike({
    threadId = 'threadId-123',
    owner = 'ownerid-123',
    commentId = 'title thread',
  }) {
    const query = {
      text: 'INSERT INTO likes_comment VALUES($1, $2, $3)',
      values: [owner, threadId, commentId],
    };

    await pool.query(query);
  },

  async findLike({
    threadId = 'threadId-123',
    owner = 'ownerid-123',
    commentId = 'title thread',
  }) {
    const query = {
      text: 'SELECT * FROM likes_comment WHERE owner = $1 AND thread_id = $2 AND comment_id = $3',
      values: [owner, threadId, commentId],
    };

    const result = await pool.query(query);
    
    return result.rows.length;
  },

  async deleteLike({
    threadId = 'threadId-123',
    owner = 'ownerid-123',
    commentId = 'title thread',
  }) {
    const query = {
      text: 'DELETE FROM likes_comment WHERE owner = $1 AND thread_id = $2 AND comment_id = $3',
      values: [owner, threadId, commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes_comment WHERE 1=1');
  },
};

module.exports = LikeTableTestHelper;
