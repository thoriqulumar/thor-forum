const DetailCommentThread = require('../../Domains/comments/entities/DetailCommentThread');

class GetThreadUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    this._validatePayload(threadId);
    await this._threadRepository.verifyExistingThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    let comments = await this._commentRepository.getCommentByThreadId(threadId);

    thread.comments = await Promise.all(
      comments.map(async (comment) => {
        const threadDetailComment = new DetailCommentThread(comment);
        return threadDetailComment.get();
      })
    );
    return thread;
  }

  _validatePayload(threadId) {
    if (typeof threadId !== 'string') {
      throw new Error(
        'GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = GetThreadUseCase;
