const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ResponseComment = require('../../../Domains/comments/entities/ResponseComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return response comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerid-123' });
      await ThreadTableTestHelper.addThread({
        id: 'threadId-123',
        owner: 'ownerid-123',
        title: 'title thread',
        body: 'body thread',
      });

      const newComment = new NewComment({
        threadId: 'threadId-123',
        content: 'content comment',
        owner: 'ownerid-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentTableTestHelper.findCommentById(
        'comment-123'
      );
      expect(comment).toHaveLength(1);
    });

    it('should return response comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerid-123' });
      await ThreadTableTestHelper.addThread({
        id: 'threadId-123',
        owner: 'ownerid-123',
        title: 'title thread',
        body: 'body thread',
      });

      const newComment = new NewComment({
        threadId: 'threadId-123',
        content: 'content comment',
        owner: 'ownerid-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const responseComment = await commentRepositoryPostgres.addComment(
        newComment
      );

      // Assert
      expect(responseComment).toStrictEqual(
        new ResponseComment({
          id: 'comment-123',
          content: newComment.content,
          owner: newComment.owner,
        })
      );
    });
  });

  describe('verifyExistingComment function', () => {
    it('should return NotFoundError when comment is not exists', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await expect(
        commentRepositoryPostgres.verifyExistingComment('comment-159')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not return NotFoundError when comment is exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerid-123' });
      await ThreadTableTestHelper.addThread({
        id: 'threadId-123',
        owner: 'ownerid-123',
        title: 'title thread',
        body: 'body thread',
      });

      await CommentTableTestHelper.addComment({
        id: 'commentId-123',
        owner: 'ownerid-123',
        threadId: 'threadId-123',
        content: 'ini adalah content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await commentRepositoryPostgres.verifyExistingComment('commentId-123');
      // Action && Assert
      await expect(
        commentRepositoryPostgres.verifyExistingComment('commentId-123')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should return AuthorizationError when user dont own the comment', async () => {
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
        owner: 'ownerId-123',
        threadId: 'threadId-123',
        content: 'ini adalah content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action && Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(
          'commentId-123',
          'owner12314124'
        )
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not return AuthorizationError when user own the comment', async () => {
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
        owner: 'ownerId-123',
        threadId: 'threadId-123',
        content: 'ini adalah content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action && Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(
          'commentId-123',
          'ownerId-123'
        )
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should return InvariantError when delete comment is not working properly', async () => {
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
        owner: 'ownerId-123',
        threadId: 'threadId-123',
        content: 'ini adalah content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action && Assert
      await expect(
        commentRepositoryPostgres.deleteComment('commentId-12314124')
      ).rejects.toThrowError(InvariantError);
    });

    it('should not return InvariantError when delete comment is working properly', async () => {
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
        owner: 'ownerId-123',
        threadId: 'threadId-123',
        content: 'ini adalah content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action && Assert
      await expect(
        commentRepositoryPostgres.deleteComment('commentId-123')
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return not found error when comment is not exists', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      // Actio & Assert
      expect(
        commentRepositoryPostgres.getCommentByThreadId('abcdefg-id')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return thread data when comment is exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'ownerid-1234' });
      await ThreadTableTestHelper.addThread({
        id: 'threadId-1234',
        owner: 'ownerid-1234',
        title: 'title thread',
        body: 'body thread',
      });

      const newComment = new NewComment({
        threadId: 'threadId-1234',
        content: 'content comment',
        owner: 'ownerid-1234',
      });

      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await commentRepositoryPostgres.addComment(newComment);

      // Action
      const responseThread =
        await commentRepositoryPostgres.getCommentByThreadId('threadId-1234');
    
      expect(responseThread[0].id).toEqual('comment-1234');
      expect(responseThread[0].content).toEqual(newComment.content);
    });
  });
});
