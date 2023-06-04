class ResponseComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  _verifyPayload(payload) {
    const { id, content, owner } = payload;

    if (!id || !content || !owner) {
      throw new Error('COMMENT_RESPONSE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('COMMENT_RESPONSE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ResponseComment;
