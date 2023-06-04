const NewThread = require('../../../Domains/threads/entities/NewThread');
const ResponseThread = require('../../../Domains/threads/entities/ResponseThread');
const ThreadRespository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'titleThread',
      body: 'bodyThread',
      owner: 'ownerThread',
    };

    const mockResponseThread = new ResponseThread({
      id: 'id-thread',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRespository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockResponseThread));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const registeredThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(registeredThread).toStrictEqual(
      new ResponseThread({
        id: 'id-thread',
        title: useCasePayload.title,
        owner: useCasePayload.owner,
      })
    );
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      })
    );
  });
});
