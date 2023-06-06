const RegisterLike = require('../RegisterLike');

describe('RegisterLike entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'owner-id',
      threadId: 'thread-id',
    };

    // Action & Assert
    expect(() => new RegisterLike(payload)).toThrowError(
      'REGISTER_LIKE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 'owner-id',
      threadId: 123,
      commentId: 'comment-id',
    };

    // Action & Assert
    expect(() => new RegisterLike(payload)).toThrowError(
      'REGISTER_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create RegisterLike entities correctly', () => {
    // Arrange
    const payload = {
      owner: 'owner-id',
      threadId: 'thread-id',
      commentId: 'comment-id',
    };

    const expectedResponse = {
      owner: 'owner-id',
      threadId: 'thread-id',
      commentId: 'comment-id',
    };
    // Action
    const responseDetailComment = new RegisterLike(payload);

    // Assert
    expect(responseDetailComment).toBeInstanceOf(Object);
    expect(responseDetailComment).toEqual(expectedResponse);
  });
});
