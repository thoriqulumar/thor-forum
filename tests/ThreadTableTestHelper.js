/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
  async addThread({
    id = 'threadId-123',
    owner = 'ownerid-123',
    title = 'title thread',
    body = 'body thread',
  }) {
    const query = {
      text: 'INSERT INTO thread VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, owner, title, body],
    };
   
    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM thread WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread WHERE 1=1');
  },
};

module.exports = ThreadTableTestHelper;
