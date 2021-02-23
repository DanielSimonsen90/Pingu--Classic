const { PinguLibrary, PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('error', null,
    async function execute(client, err) {
        return PinguLibrary.errorLog(client, `Client event`, null, err);
    }
);