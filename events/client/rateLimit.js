const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('rateLimit', null,
    async function execute(client, { limit, timeDifference }) {
        return client.log('error', `I'm being ratelimited by **${limit}**, which is costing me ${timeDifference}`)
    }
);