const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'idThread',
      content: ' content of comment',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError(
      'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'idThread',
      content: 123,
      owner: 'idOwner',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError(
      'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create NewComment entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'idThread',
      content: 'content of owner',
      owner: 'idOwner',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
