const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AppTestHelper = require('../../../../tests/AppTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });
  // POST
  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and success when add like', async () => {
      // Arrange
      const createUserPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      await AppTestHelper.createUser(createUserPayload);
      const headers = await AppTestHelper.loginAndGetAuth({
        username: createUserPayload.username,
        password: createUserPayload.password,
      });
      const createThreadPayload = {
        title: 'title dicoding',
        body: 'body dicoding',
      };
      const threadData = await AppTestHelper.createThread({
        headers: headers,
        payloads: createThreadPayload,
      });

      const createCommentPayload = {
        content: 'ini content comment',
      };

      const commentData = await AppTestHelper.createComment({
        headers: headers,
        payloads: createCommentPayload,
        threadId: threadData.id,
      });
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadData.id}/comments/${commentData.id}/likes`,
        headers,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 and success when delete like', async () => {
      // Arrange
      const createUserPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      await AppTestHelper.createUser(createUserPayload);
      const headers = await AppTestHelper.loginAndGetAuth({
        username: createUserPayload.username,
        password: createUserPayload.password,
      });
      const createThreadPayload = {
        title: 'title dicoding',
        body: 'body dicoding',
      };
      const threadData = await AppTestHelper.createThread({
        headers: headers,
        payloads: createThreadPayload,
      });

      const createCommentPayload = {
        content: 'ini content comment',
      };

      const commentData = await AppTestHelper.createComment({
        headers: headers,
        payloads: createCommentPayload,
        threadId: threadData.id,
      });

      // do like first
      await AppTestHelper.likeOrDislikeComment({
        headers: headers,
        threadId: threadData.id,
        commentId: commentData.id,
      });
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadData.id}/comments/${commentData.id}/likes`,
        headers,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when not authorized', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/randomThreadId-12314124/comments/randomCommentId-12314124/likes`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });
});
