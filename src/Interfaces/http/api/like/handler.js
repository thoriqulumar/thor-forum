const LikeUseCase = require('../../../../Applications/use_case/LikeUseCase');

class LikeHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const payload = {
      threadId,
      owner,
      commentId,
    };

    const likeUseCase = this._container.getInstance(LikeUseCase.name);
    await likeUseCase.execute(payload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikeHandler;
