const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeUseCase = require('../LikeUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'idComment',
      threadId: 'idThread',
      owner: 'owner-id',
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyExistingThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyExistingComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyExistingLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(null));
    mockLikeRepository.addLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyExistingThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyExistingComment).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockLikeRepository.verifyExistingLike).toBeCalledWith(
      useCasePayload
    );
    expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload);
  });

  it('should orchestrating the delete like action correctly', async () => {
    /// Arrange
    const useCasePayload = {
      commentId: 'idComment',
      threadId: 'idThread',
      owner: 'owner-id',
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyExistingThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyExistingComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyExistingLike = jest.fn().mockImplementation(() =>
      Promise.resolve({
        commentId: 'idComment',
        threadId: 'idThread',
        owner: 'owner-id',
      })
    );
    mockLikeRepository.deleteLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyExistingThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyExistingComment).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockLikeRepository.verifyExistingLike).toBeCalledWith(
      useCasePayload
    );
    expect(mockLikeRepository.deleteLike).toBeCalledWith(
      useCasePayload
    );
  });
});
