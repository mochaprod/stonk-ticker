const path = require("path");

const publicPath = "/";
const staticPath = path.join("examples", "public");
const indexHtml = path.join(staticPath, "index.html");

module.exports = {
    publicPath,
    staticPath,
    indexHtml,
};
