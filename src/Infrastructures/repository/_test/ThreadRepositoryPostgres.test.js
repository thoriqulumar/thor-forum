const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ResponseThread = require('../../../Domains/threads/entities/ResponseThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return response thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerid-123' });
      const newThread = new NewThread({
        title: 'title thread',
        body: 'body thread',
        owner: 'ownerid-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const thread = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return response thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerid-123' });
      const newThread = new NewThread({
        title: 'title thread',
        body: 'body thread',
        owner: 'ownerid-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const responseThread = await threadRepositoryPostgres.addThread(
        newThread
      );

      // Assert
      expect(responseThread).toStrictEqual(
        new ResponseThread({
          id: 'thread-123',
          title: 'title thread',
          owner: 'ownerid-123',
        })
      );
    });
  });

  describe('verifyExistingThread function', () => {
    it('should return not found error when thread is not exists', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      // Actio & Assert
      expect(
        threadRepositoryPostgres.verifyExistingThread('abcdefg-id')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not return not found error when thread is not exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerid-123' });
      const newThread = new NewThread({
        title: 'title thread',
        body: 'body thread',
        owner: 'ownerid-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);
  
      await expect(
        threadRepositoryPostgres.verifyExistingThread(addedThread.id)
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should return not found error when thread is not exists', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      // Actio & Assert
      expect(
        threadRepositoryPostgres.getThreadById('abcdefg-id')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return thread data when thread is exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerid-123' });
      const newThread = new NewThread({
        title: 'title thread',
        body: 'body thread',
        owner: 'ownerid-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Action
      const responseThread = await threadRepositoryPostgres.getThreadById(
        addedThread.id
      );

      expect(responseThread.id).toEqual('thread-123');
      expect(responseThread.title).toEqual(newThread.title);
      expect(responseThread.body).toEqual(newThread.body);
    });
  });
});
