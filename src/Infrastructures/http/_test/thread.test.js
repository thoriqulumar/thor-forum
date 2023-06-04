const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AppTestHelper = require('../../../../tests/AppTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
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
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.owner).toEqual(userData.id);
    });

    it('should response 401 when not authorized', async () => {
      // Arrange
      const createThreadPayload = {
        title: 'title dicoding',
        body: 'body dicoding',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
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
        username: 'dicoding1',
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
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const createUserPayload = {
        username: 'dicoding12',
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
        body: true,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: createThreadPayload,
        headers,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      );
    });
  });

  describe('when GET /threads', () => {
    it('should response 200 and return detail thread with its comments', async () => {
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
        content: 'ini comment',
      };

      await AppTestHelper.createComment({
        headers: headers,
        payloads: createCommentPayload,
        threadId: threadData.id,
      });
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadData.id}`,
        headers,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(threadData.id);
    });

    it('should response 404 when thread is not exists', async () => {
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
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/xxxxxx`,
        headers,
      });
 
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
