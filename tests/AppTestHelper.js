/* istanbul ignore file */
const container = require('../src/Infrastructures/container');
const createServer = require('../src/Infrastructures/http/createServer');

const AppTestHelper = {
  async createUser({
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia',
  }) {
    const userPayload = {
      username,
      password,
      fullname,
    };

    const server = await createServer(container);
    const responseCreateUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload,
    });
    const userResponseJson = JSON.parse(responseCreateUser.payload);
    const userData = userResponseJson.data.addedUser;

    return userData;
  },
  async loginAndGetAuth({ username, password }) {
    const authPayload = {
      username,
      password,
    };
    const server = await createServer(container);
    const authResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: authPayload,
    });
    const authResponseJson = JSON.parse(authResponse.payload);
    const headers = {
      Authorization: `Bearer ${authResponseJson.data.accessToken}`,
    };
    return headers;
  },

  async createThread({ headers, payloads }) {
    const server = await createServer(container);
    const threadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: payloads,
      headers,
    });

    const threadResponseJson = JSON.parse(threadResponse.payload);
    const threadData = threadResponseJson.data.addedThread;

    return threadData;
  },

  async createComment({ headers, payloads, threadId }) {
    const server = await createServer(container);
    const commentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: payloads,
      headers,
    });

    const commentResponseJson = JSON.parse(commentResponse.payload);

    const commentData = commentResponseJson.data.addedComment;

    return commentData;
  },

  async likeOrDislikeComment({ headers, threadId, commentId }) {
    const server = await createServer(container);
    const likeResponse = await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/${commentId}/likes`,
      headers,
    });

    const likeResponnseJson = JSON.parse(likeResponse.payload);

    return likeResponnseJson;
  },
};

module.exports = AppTestHelper;
