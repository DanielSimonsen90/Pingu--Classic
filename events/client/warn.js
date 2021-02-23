const { PinguLibrary, PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('warn', null,
    async function execute(client, warning) {
        return PinguLibrary.errorLog(client, "**Warning:**\n```" + `${warning}\n` + "```");
    }
);