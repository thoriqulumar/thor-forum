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
    const like = await this._likeRepository.verifyExistingLike(
      useCasePayload.commentId,
      useCasePayload.owner,
      useCasePayload.threadId
    );
    if (like) {
      await this._likeRepository.deleteLike(
        useCasePayload.commentId,
        useCasePayload.owner,
        useCasePayload.threadId
      );
    } else {
      await this._likeRepository.addLike(
        useCasePayload.commentId,
        useCasePayload.owner,
        useCasePayload.threadId
      );
    }
  }
}

module.exports = LikeUseCase;
