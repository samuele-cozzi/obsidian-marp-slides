module.exports = ({ marp }) => 
  marp.use(require("./markdown-it/@kazumatu981/markdown-it-kroki/index"))
  .use(require("./markdown-it/markdown-it-mark/dist/markdown-it-mark.min")) 
  .use(require("./markdown-it/markdown-it-container/dist/markdown-it-container.min"), "container");