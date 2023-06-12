const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepostioryPostgres = require('../LikeRepositoryPostgres');
const RegisterLike = require('../../../Domains/likes/entities/RegisterLike');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');

describe('LikeRepostioryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await LikeTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist new thread and return response thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerId-123' });
      await ThreadTableTestHelper.addThread({
        id: 'threadId-123',
        owner: 'ownerId-123',
        title: 'title thread',
        body: 'body thread',
      });
      await CommentTableTestHelper.addComment({
        id: 'commentId-123',
        threadId: 'threadId-123',
        content: 'ini adalah content',
        owner: 'ownerId-123',
      });

      const payloadLike = {
        threadId: 'threadId-123',
        owner: 'ownerId-123',
        commentId: 'commentId-123',
      };

      const newLike = new RegisterLike(payloadLike);

      const likeRepositoryPostgres = new LikeRepostioryPostgres(pool);

      // Action
      await likeRepositoryPostgres.addLike(newLike);

      // Assert
      const like = await LikeTableTestHelper.findLike(payloadLike);
      expect(like).toEqual(1);
    });

    it('should return response thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerId-123' });
      await ThreadTableTestHelper.addThread({
        id: 'threadId-123',
        owner: 'ownerId-123',
        title: 'title thread',
        body: 'body thread',
      });
      await CommentTableTestHelper.addComment({
        id: 'commentId-123',
        threadId: 'threadId-123',
        content: 'ini adalah content',
        owner: 'ownerId-123',
      });

      const payloadLike = {
        threadId: 'threadId-123',
        owner: 'ownerId-123',
        commentId: 'commentId-123',
      };

      const newLike = new RegisterLike(payloadLike);

      const likeRepositoryPostgres = new LikeRepostioryPostgres(pool);

      // Action
      const responseThread = await likeRepositoryPostgres.addLike(newLike);

      // Assert
      expect(responseThread).toStrictEqual(new RegisterLike(payloadLike));
    });
  });

  describe('verifyExistingLike function', () => {
    it('should return false when like is not exists', async () => {
      // Arrange
      const threadRepositoryPostgres = new LikeRepostioryPostgres(pool);
      // Actio & Assert
      expect(
        threadRepositoryPostgres.verifyExistingLike({
          threadId: 'threadId-1234',
          owner: 'ownerId-1234',
          commentId: 'commentId-1234',
        })
      ).resolves.toStrictEqual(false);
    });

    it('should return true  when like is exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerId-123' });
      await ThreadTableTestHelper.addThread({
        id: 'threadId-123',
        owner: 'ownerId-123',
        title: 'title thread',
        body: 'body thread',
      });
      await CommentTableTestHelper.addComment({
        id: 'commentId-123',
        threadId: 'threadId-123',
        content: 'ini adalah content',
        owner: 'ownerId-123',
      });

      const payloadLike = {
        threadId: 'threadId-123',
        owner: 'ownerId-123',
        commentId: 'commentId-123',
      };

      const newLike = new RegisterLike(payloadLike);

      const likeRepositoryPostgres = new LikeRepostioryPostgres(pool);
      // Action
      await likeRepositoryPostgres.addLike(newLike);

      await expect(
        likeRepositoryPostgres.verifyExistingLike(payloadLike)
      ).resolves.toStrictEqual(true);
    });
  });

  describe('deleteLike function', () => {
    it('should return InvariantError when delete process is error', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepostioryPostgres(pool);
      // Actio & Assert
      expect(
        likeRepositoryPostgres.deleteLike({
          threadId: 'adsasd-123',
          owner: 'asdasd-123',
          commentId: 'asdasd-123',
        })
      ).rejects.toThrowError(InvariantError);
    });

    it('should return not InvariantError when delete process is not error', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerId-123' });
      await ThreadTableTestHelper.addThread({
        id: 'threadId-123',
        owner: 'ownerId-123',
        title: 'title thread',
        body: 'body thread',
      });
      await CommentTableTestHelper.addComment({
        id: 'commentId-123',
        threadId: 'threadId-123',
        content: 'ini adalah content',
        owner: 'ownerId-123',
      });

      const payloadLike = {
        threadId: 'threadId-123',
        owner: 'ownerId-123',
        commentId: 'commentId-123',
      };

      await LikeTableTestHelper.addLike(payloadLike);

      const likeRepositoryPostgres = new LikeRepostioryPostgres(pool);

      // Actio & Assert
      await expect(
        likeRepositoryPostgres.deleteLike(payloadLike)
      ).resolves.not.toThrowError(InvariantError);
      const like = await LikeTableTestHelper.findLike(payloadLike);
      expect(like).toEqual(0);
    });
  });

  describe('getLikesByComment function', () => {
    it('should return 0 when like is not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerId-123' });
      await ThreadTableTestHelper.addThread({
        id: 'threadId-123',
        owner: 'ownerId-123',
        title: 'title thread',
        body: 'body thread',
      });
      await CommentTableTestHelper.addComment({
        id: 'commentId-123',
        threadId: 'threadId-123',
        content: 'ini adalah content',
        owner: 'ownerId-123',
      });

      const likeRepositoryPostgres = new LikeRepostioryPostgres(pool);
      // Actio & Assert
      expect(
        likeRepositoryPostgres.getLikesByComment('commentId-123')
      ).resolves.toStrictEqual(0);
    });

    it('should return thread data when thread is exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerId-123' });
      await ThreadTableTestHelper.addThread({
        id: 'threadId-123',
        owner: 'ownerId-123',
        title: 'title thread',
        body: 'body thread',
      });
      await CommentTableTestHelper.addComment({
        id: 'commentId-123',
        threadId: 'threadId-123',
        content: 'ini adalah content',
        owner: 'ownerId-123',
      });

      const payloadLike = {
        threadId: 'threadId-123',
        owner: 'ownerId-123',
        commentId: 'commentId-123',
      };

      await LikeTableTestHelper.addLike(payloadLike);

      const likeRepositoryPostgres = new LikeRepostioryPostgres(pool);
      // Actio & Assert
      expect(
        likeRepositoryPostgres.getLikesByComment('commentId-123')
      ).resolves.toStrictEqual(1);
    });
  });
});
