const DetailCommentThread = require('../DetailCommentThread');

describe('DetailCommentThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'userid',
      username: 'username',
      date: 'tanggal',
      is_deleted: false,
    };

    // Action & Assert
    expect(() => new DetailCommentThread(payload)).toThrowError(
      'DETAIL_COMMENT_THREAD_RESPONSE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'userid',
      username: 'username',
      content: true,
      date: 'tanggal',
      is_deleted: false,
    };

    // Action & Assert
    expect(() => new DetailCommentThread(payload)).toThrowError(
      'DETAIL_COMMENT_THREAD_RESPONSE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('hould create DetailCommentThread entities correctly when is_delete = true', () => {
    // Arrange
    const payload = {
      id: 'userid',
      username: 'username',
      content: 'ini content',
      date: 'tanggal',
      is_deleted: true,
    };

    const expectedResponse = {
      id: 'userid',
      username: 'username',
      content: '**komentar telah dihapus**',
      date: 'tanggal',
    };
    // Action
    const responseDetailComment = new DetailCommentThread(payload).get();

    // Assert
    expect(responseDetailComment).toBeInstanceOf(Object);
    expect(responseDetailComment.id).toEqual(expectedResponse.id);
    expect(responseDetailComment.username).toEqual(expectedResponse.username);
    expect(responseDetailComment.content).toEqual(expectedResponse.content);
    expect(responseDetailComment.date).toEqual(expectedResponse.date);
  });

  it('should create DetailCommentThread entities correctly', () => {
    // Arrange;
    const payload = {
      id: 'userid',
      username: 'username',
      content: 'ini content',
      date: 'tanggal',
      is_deleted: false,
    };

    const expectedResponse = {
      id: 'userid',
      username: 'username',
      content: 'ini content',
      date: 'tanggal',
    };
    // Action
    const responseDetailComment = new DetailCommentThread(payload).get();
    // Assert
    expect(responseDetailComment).toBeInstanceOf(Object);
    expect(responseDetailComment.id).toEqual(expectedResponse.id);
    expect(responseDetailComment.username).toEqual(expectedResponse.username);
    expect(responseDetailComment.content).toEqual(expectedResponse.content);
    expect(responseDetailComment.date).toEqual(expectedResponse.date);
  });
});
