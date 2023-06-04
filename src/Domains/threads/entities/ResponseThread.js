class ResponseThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.owner = payload.owner;
  }

  _verifyPayload(payload) {
    const { id, title, owner } = payload;

    if (!title || !id || !owner) {
      throw new Error('THREAD_RESPONSE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('THREAD_RESPONSE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ResponseThread;
