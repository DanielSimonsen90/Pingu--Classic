const { TextChannel, Message, MessageAttachment } = require('discord.js');
const { PinguCommand, config } = require('PinguPackage');

const nodemailer = require('nodemailer');
const { emailer } = config, { google } = require('googleapis'), { OAuth2 } = google.auth,
    googleClient = new OAuth2(emailer.id, emailer.secret, "https://developers.google.com/oauthplayground");
googleClient.setCredentials({ refresh_token: config.emailer.refreshToken });

module.exports = new PinguCommand('apply', 'GuildSpecific', `Filters through previous applications sent in channel and selects 4 random ones`, {
    guildOnly: true,
    specificGuildID: '460926327269359626',
    usage: '[amount of companies to select]'
}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {
    if (message.channel.name != 'applications-cmd') {
        //Find channel or make one and deny @everyone from viewing
        let channel = await getChannel('applications-cmd');
        return message.channel.send((channel ? `Please use this command in ${channel}!` : `Please create a #applications-cmd channel!`));
    }

    let applicationsChannel = await getChannel('applications');

    let messages = (await applicationsChannel.messages.fetch({ limit: 3 })).array();
    let companyInfo = messages.map(m =>
        m.content.split('\n').map(companyInfo => {
            let [email, name] = companyInfo.split('|');
            return email.includes('**') ? null : new Company(name, email, m.createdAt.getMonth());
        }).filter(v => v));

    let companies = getCompanies().filter(c => {
        let preCompanies = [];
        companyInfo.forEach(companies => preCompanies.concat(...companies));
        return preCompanies.map(pc => c.name != pc.name);
    });

    let companiesToBother = (function getCompaniesToBother() {
        let max = args[0] && parseInt(args[0]) || 4;
        let arr = [];
        for (var i = 0; i < max; i++) {
            let randomCompany = companies[Math.floor(Math.random() * companies.length)];
            arr.push(randomCompany);
            companies = companies.filter(c => c.name != randomCompany.name);
        }
        return arr;
    })();

    var transporter = nodemailer.createTransport(await Mail.getInfo());

    let templateMessages = (await (await getChannel('application-template'))?.messages.fetch({ limit: 2 })).array().reverse();
    if (!templateMessages.length) return message.channel.send(`No template message!`);
    let templateMessage = {
        content: templateMessages[0].content,
        attachments: templateMessages[0].attachments.array()
    };
    templateMessage.attachments.push(templateMessages[1].attachments.first());

    var responseMessage = `**${getMonthString(new Date(Date.now()).getMonth())} ${new Date(Date.now()).getFullYear()}**\n`;
    for (var company of companiesToBother) {
        if (company.link.includes('@'))
            await transporter.sendMail(await Mail.send(company, templateMessage)).catch(err => applicationsChannel.send(err))
        responseMessage += `${company.link} | ${company.link}\n`
    }

    applicationsChannel.send(responseMessage);

    /**@param {string} name
      @returns {Promise<TextChannel>}*/
    async function getChannel(name) {
        /**@param {TextChannel} c*/
        const giveViewPerms = (c) => c.createOverwrite(client.user, { VIEW_CHANNEL: true });
        /**@returns {Promise<TextChannel>} c*/
        const createChannel = () => message.guild.channels.create(name, {
            permissionOverwrites: [{
                deny: 'VIEW_CHANNEL',
                type: 'role',
                id: '460926327269359626'
            }, {
                allow: 'VIEW_CHANNEL',
                type: 'member',
                id: client.id
            }]
        }).catch(() => { return undefined; });

        for (var channel of message.guild.channels.cache.array()) {
            if (channel.name == name && (channel.permissionsFor(client.user).has('VIEW_CHANNEL') || await giveViewPerms(channel)))
                return channel;
        }
        return createChannel();
    }
})

class Company {
    /**@param {string} name
     * @param {string} link*/
    constructor(name, link) {
        this.name = name;
        this.link = link;
    }
}
function getCompanies() {
    return [
        new Company('Clienti A/S', 'ansog@clienti.dk'),
        new Company('FLEXDANMARK', 'info@flexdanmark.dk'),
        new Company('Kong Gulerod Reklamebureau ApS', 'info@konggulerod.dk'),
        new Company('Nordjyllands Trafikselvskab', 'info@NTmail.dk'),
        new Company('WEXO A/S', 'tommy@wexo.dk'),
        new Company('Centrica Enregy Trading A/S', 'info@neas.dk'),
        new Company('Spar Nord Bank A/S', 'sparnord@sparnord.dk'),
        new Company('Combine A/S', 'info@combine.dk'),
        new Company('Netcompany A/S', 'info@netcompany.com'),
        new Company('SOLUDYNE ApS', 'kkh@maqis.dk'),
        new Company('Digital Parners ApS', 'job@digitalpartners.dk'),
        new Company('Grundfos', 'https://www.grundfos.com/dk/about-us/career/grow/laerlinge-og-elever/sog-ledige-laerepladser')
    ]
}

class Mail {
    static async getInfo() {
        const accessToken = await googleClient.getAccessToken();
        return {
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'danielsimonsen90@gmail.com',
                clientId: config.emailer.id,
                clientSecret: config.emailer.secret,
                refreshToken: config.emailer.refreshToken,
                accessToken
            }
        };
    }
    /**@param {Company} company
       @param {{content: string, attachments: MessageAttachment[]}} message
       @returns {import('nodemailer').SendMailOptions}*/
    static async send(company, message) {
        const from = (await this.getInfo()).auth.user;
        return {
            from,
            to: company.link,
            bcc: 'Ansoegningdata@techcollege.dk',
            subject: "Datatekniker m. speciale i programmering",
            text: message.content.replace('$name$', company.name),
            attachments: message.attachments.map(a => { return { filename: a.name, content: a.attachment } })
        }
    }
}

/**@param {number} month*/
function getMonthString(month) {
    return ["Janurary", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month];
}