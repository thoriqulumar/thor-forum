const ResponseComment = require('../ResponseComment');

describe('ResponseComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'userid',
      owner: 'ownerid',
    };

    // Action & Assert
    expect(() => new ResponseComment(payload)).toThrowError(
      'COMMENT_RESPONSE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'userid',
      content: 123,
      owner: 'ownerid',
    };

    // Action & Assert
    expect(() => new ResponseComment(payload)).toThrowError(
      'COMMENT_RESPONSE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create ResponseComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'userid',
      content: 'ini adalah content',
      owner: 'ownerid',
    };

    // Action
    const responseComment = new ResponseComment(payload);

    // Assert
    expect(responseComment).toBeInstanceOf(ResponseComment);
    expect(responseComment.id).toEqual(payload.id);
    expect(responseComment.content).toEqual(payload.content);
    expect(responseComment.owner).toEqual(payload.owner);
  });
});
