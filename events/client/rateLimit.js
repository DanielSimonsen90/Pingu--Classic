const { PinguLibrary, PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('rateLimit', null,
    async function execute(client, info) {
        return PinguLibrary.errorLog(client, `I'm being ratelimited by **${info.limit}**, which is costing me ${info.timeDifference}`);
    }
);