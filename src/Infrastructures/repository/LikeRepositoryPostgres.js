const RegisterLike = require('../../Domains/likes/entities/RegisterLike');
const LikeRepository = require('../../Domains/likes/LikeRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async verifyExistingLike(comment) {
    const { threadId, commentId, owner } = comment;
    const query = {
      text: 'SELECT * FROM likes_comment WHERE owner = $1 AND thread_id = $2 AND comment_id = $3',
      values: [owner, threadId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return false;
    }
    return true;
  }

  async deleteLike(comment) {
    const { threadId, commentId, owner } = comment;
    const query = {
      text: 'DELETE FROM likes_comment WHERE owner = $1 AND thread_id = $2 AND comment_id = $3',
      values: [owner, threadId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('gagal menghapus like');
    }
  }

  async addLike(comment) {
    const { threadId, commentId, owner } = comment;
    const query = {
      text: 'INSERT INTO likes_comment VALUES($1, $2, $3) RETURNING comment_id, owner, thread_id',
      values: [owner, threadId, commentId],
    };

    const result = await this._pool.query(query);

    return new RegisterLike({
      threadId: result.rows[0].thread_id,
      commentId: result.rows[0].comment_id,
      owner: result.rows[0].owner,
    });
  }

  async getLikesByComment(id) {
    const query = {
      text: 'SELECT COUNT(*) FROM likes_comment WHERE comment_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return parseInt(result.rows[0].count);
  }
}

module.exports = LikeRepositoryPostgres;
