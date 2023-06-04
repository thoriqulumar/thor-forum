const ResponseThread = require('../ResponseThread');

describe('ResponseThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'id-thread',
      title: 'titleThread',
    };

    // Action & Assert
    expect(() => new ResponseThread(payload)).toThrowError(
      'THREAD_RESPONSE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'id-thread',
      title: 'titleThread',
      owner: 123,
    };

    // Action & Assert
    expect(() => new ResponseThread(payload)).toThrowError(
      'THREAD_RESPONSE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'id-thread',
      title: 'titleThread',
      owner: 'ownerThread',
    };

    // Action
    const responseThread = new ResponseThread(payload);

    // Assert
    expect(responseThread).toBeInstanceOf(ResponseThread);
    expect(responseThread.id).toEqual(payload.id);
    expect(responseThread.title).toEqual(payload.title);
    expect(responseThread.owner).toEqual(payload.owner);
  });
});
