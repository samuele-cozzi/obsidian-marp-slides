module.exports = ({ marp }) => 
  marp.use(require("markdown-it-container"), "container")
  .use(require('markdown-it-mark'))
  .use(require("@kazumatu981/markdown-it-kroki"),{entrypoint: "https://kroki.io"});