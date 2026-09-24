const startServer = require("../server");

let serverPromise;

module.exports = async (req, res) => {
    if (!serverPromise) {
        serverPromise = startServer();
    }

    const server = await serverPromise;

    server.emit("request", req, res);
};
