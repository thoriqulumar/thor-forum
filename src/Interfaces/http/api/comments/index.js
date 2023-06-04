const CommentHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'comment',
  register: async (server, { container }) => {
    const commentHandler = new CommentHandler(container);
    server.route(routes(commentHandler));
  },
};
