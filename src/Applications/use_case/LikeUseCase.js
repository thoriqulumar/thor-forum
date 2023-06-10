class LikeUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyExistingThread(useCasePayload.threadId);
    await this._commentRepository.verifyExistingComment(
      useCasePayload.commentId
    );
    const like = await this._likeRepository.verifyExistingLike({
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
    });
    if (like) {
      await this._likeRepository.deleteLike({
        commentId: useCasePayload.commentId,
        owner: useCasePayload.owner,
        threadId: useCasePayload.threadId,
      });
    } else {
      await this._likeRepository.addLike({
        commentId: useCasePayload.commentId,
        owner: useCasePayload.owner,
        threadId: useCasePayload.threadId,
      });
    }
  }
}

module.exports = LikeUseCase;
