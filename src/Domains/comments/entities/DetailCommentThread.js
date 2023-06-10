class DetailCommentThread {
  constructor(comment) {
    this._verifyPayload(comment);
    this._comment = comment;
  }

  _verifyPayload({ id, username, content, date, is_deleted }) {
    if (!id || !username || !content || !date) {
      throw new Error(
        'DETAIL_COMMENT_THREAD_RESPONSE.NOT_CONTAIN_NEEDED_PROPERTY'
      );
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof content !== 'string' ||
      typeof is_deleted !== 'boolean'
    ) {
      throw new Error(
        'DETAIL_COMMENT_THREAD_RESPONSE.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }

  execute(like) {
    const { id, username, content, date, is_deleted } = this._comment;
    return {
      id,
      username,
      date,
      content: is_deleted ? '**komentar telah dihapus**' : content,
      likeCount: like,
    };
  }
}

module.exports = DetailCommentThread;
