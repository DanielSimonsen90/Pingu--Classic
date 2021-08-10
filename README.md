# PinguPackage

### TypeScript module used for [Pingu](https://github.com/DanielSimonsen90/Pingu)

## Install

In PinguPackage directory: `npm link`
In project directory: `npm link pingupackage`

Some strange example because yes
```js
import { PinguCommand } from 'PinguPackage';

module.exports = new PinguCommand('github-example', 'Utility', 'This is a Github example', {
 guildOnly: true
}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
  return message.channel.send(`Example command worked!`);
}
```
