const { PinguLibrary, PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('invalidated', null,
    async function execute(client) {
        return PinguLibrary.errorLog(client, `Invalidated called`);
    }
);