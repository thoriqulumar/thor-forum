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
  describe('when POST /threads/{id}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const createUserPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const userData = await AppTestHelper.createUser(createUserPayload);
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
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadData.id}/comments`,
        payload: createCommentPayload,
        headers,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(
        createCommentPayload.content
      );
      expect(responseJson.data.addedComment.owner).toEqual(userData.id);
    });

    it('should response 401 when not authorized', async () => {
      // Arrange
      const createCommentPayload = {
        content: 'ini content comment',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/sampleIdComment-123/comments`,
        payload: createCommentPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
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
        notContent: 'ini bukan content comment',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadData.id}/comments`,
        payload: createCommentPayload,
        headers,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
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
        content: 123,
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadData.id}/comments`,
        payload: createCommentPayload,
        headers,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai'
      );
    });
  });

  // DELETE
  describe('when DELETE /threads/{id}/comments', () => {
    it('should response 200 when successfully delete the comment', async () => {
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
        headers,
        payloads: createCommentPayload,
        threadId: threadData.id,
      });

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadData.id}/comments/${commentData.id}`,
        headers,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when not authorized', async () => {
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-132/comments/comment-123`,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread id is not valid', async () => {
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

      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/xxx/comments/comment-123`,
        headers,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment id is not valid', async () => {
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

      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadData.id}/comments/comment-123`,
        headers,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 403 when try to delete others comment', async () => {
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

      const createUserA = {
        username: 'userA',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const createUserB = {
        username: 'userB',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      await AppTestHelper.createUser(createUserA);
      await AppTestHelper.createUser(createUserB);

      const headersA = await AppTestHelper.loginAndGetAuth({
        username: createUserA.username,
        password: createUserA.password,
      });

      const headersB = await AppTestHelper.loginAndGetAuth({
        username: createUserB.username,
        password: createUserB.password,
      });

      const createCommentA = {
        content: 'ini content comment',
      };

      const commentDataA = await AppTestHelper.createComment({
        headers: headersA,
        payloads: createCommentA,
        threadId: threadData.id,
      });

      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadData.id}/comments/${commentDataA.id}`,
        headers: headersB,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('user tidak memiliki akses');
    });
  });
});
