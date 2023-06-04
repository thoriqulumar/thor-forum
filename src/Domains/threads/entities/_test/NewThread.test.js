const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'titleThread',
      owner: 'ownerThread',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(
      'THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'titleThread',
      body: 123,
      owner: 'ownerThread',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(
      'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'titleThread',
      body: 'bodyThread',
      owner: 'ownerThread',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});
