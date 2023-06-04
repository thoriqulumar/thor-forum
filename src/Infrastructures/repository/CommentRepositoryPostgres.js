const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const ResponseComment = require('../../Domains/comments/entities/ResponseComment');
const InvariantError = require('../../Commons/exceptions/InvariantError');
// const InvariantError = require('../../Commons/exceptions/InvariantError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { threadId, content, owner } = comment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO thread_comment VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, owner, threadId, content],
    };

    const result = await this._pool.query(query);

    return new ResponseComment({ ...result.rows[0] });
  }

  async verifyExistingComment(id) {
    const query = {
      text: 'SELECT * FROM thread_comment WHERE id = $1 AND is_deleted = false',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM thread_comment WHERE id = $1 AND owner = $2 AND is_deleted = false',
      values: [id, owner],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('user tidak memiliki akses');
    }
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE thread_comment SET is_deleted = true WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('gagal menghapus comment');
    }
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: ` SELECT thread_comment.id, thread_comment.date, thread_comment.content, thread_comment.is_deleted, users.username FROM thread_comment
      LEFT JOIN users ON users.id = thread_comment.owner
      WHERE thread_id = $1
      ORDER BY thread_comment.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
