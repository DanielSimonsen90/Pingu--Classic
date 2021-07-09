const { TextChannel, Message, MessageAttachment } = require('discord.js');
const { PinguCommand, config, PinguLibrary, Error } = require('PinguPackage');

const nodemailer = require('nodemailer');
const { emailer, testingMode } = config, { google } = require('googleapis'), { OAuth2 } = google.auth,
    googleClient = new OAuth2(emailer.id, emailer.secret, "https://developers.google.com/oauthplayground");
googleClient.setCredentials({ refresh_token: config.emailer.refreshToken });

module.exports = new PinguCommand('apply', 'GuildSpecific', `Filters through previous applications sent in channel and selects 4 random ones`, {
    guildOnly: true,
    specificGuildID: '460926327269359626',
    usage: '[amount of companies to select]',
    mustBeBeta: true
}, async ({ client, message, args }) => {
    if (message.author.id != PinguLibrary.Developers.get('Danho').id)
        return message.channel.send(`You are not authorized to run this command!`);

    if (message.channel.name != 'applications-cmd') {
        //Find channel or make one and deny @everyone from viewing
        let channel = await getChannel('applications-cmd');
        return message.channel.send((channel ? `Please use this command in ${channel}!` : `Please create a #applications-cmd channel!`));
    }

    //Get #applications channel
    let applicationsChannel = await getChannel('applications');

    //Get last 3 messages in #applications as Message[]
    let messages = (await applicationsChannel.messages.fetch({ limit: 3 })).array();

    /*
    //Create companyInfo, converting last 3 messages from #applications to a Company[][]
    let companyInfo = messages.map(m => messageToCompanies(m));

    //Create companies, filtering from all companies in (testingMode ? #companies-test : #companies)
    let companies = (await getCompanies()).filter(c => {
        let preCompanies = [];
        //Set preCompanies to last companies in companyInfo as Company[]
        companyInfo.forEach(companies => preCompanies = preCompanies.concat(...companies));
        //If preCompanies includes the c-company, return false
        return !preCompanies.find(pc => c.name == pc.name);
    });
    */
    
    let preCompanies = messages.map(m => messageToCompanies(m))                        //Convert last 3 messages in #applications as Company[][]
        .reduce((result, companyArr) => result.concat(...companyArr), [])              //Reduce companies to one singular array: Company[]
        .map(c => c.name.split(' ')[0]);                                               //Map to be first word of name; string[]
        
    //From all companies in (testingMode ? #companies-test : #companies), filter away the companies that are in preCompanies, returning a Company[] of companies applicable to be bothered
    let applicableCompanies = (await getCompanies()).filter(c => !preCompanies.some(co => co.startsWith(c.name.split(' ')[0])));

    let companiesToBother = (function getCompaniesToBother() {
        //Total of companies to bother
        let max = args[0] && parseInt(args[0]) || 4;

        //If max is too high, throw error
        if (max > applicableCompanies.length) throw new Error({
            message: `The max provided, ${max}, is too high for the applicable companies length, ${applicableCompanies.length}!`
        });

        //Define result as Company[], pushing ${max} random companies, where each company is removed from applicableCompanies
        let result = [];
        for (var i = 0; i < max; i++) {
            let randomCompany = applicableCompanies[Math.floor(Math.random() * applicableCompanies.length)];
            result.push(randomCompany);
            // applicableCompanies = applicableCompanies.filter(c => c.name != randomCompany.name);
            applicableCompanies.splice(applicableCompanies.indexOf(randomCompany), 1);
        }
        return result;
    })();

    var transporter = nodemailer.createTransport(await Mail.getInfo());

    let applicationTemplateChannel = await getChannel('application-template');
    //Fetch 3 messages from #application-template and reverse array: [text, attachment, attachment]
    let templateMessages = applicationTemplateChannel && (await applicationTemplateChannel.messages.fetch({ limit: 3 })).array().reverse();
    if (!templateMessages.length) return message.channel.send(`No template message!`);
    else if (templateMessages.length < 3) return message.channel.send(`Not enough template messages!`);
    else if (templateMessages.length > 3) return message.channel.send(`Too many template messages!`);

    //Define templateMessage with body as templateMessages[0], and attachments of last 2 messages in templateMessages.
    const [messageContent, messageAttachmentOne, messageAttachmentTwo] = templateMessages;
    let templateMessage = {
        content: messageContent.content,
        attachments: [messageAttachmentOne.attachments.first(), messageAttachmentTwo.attachments.first()]
    };

    var responseMessage = `**${getMonthString(new Date(Date.now()).getMonth())} ${new Date(Date.now()).getFullYear()}**\n`;
    for (var company of companiesToBother) {
        if (company.link.includes('@'))
            await transporter.sendMail(await Mail.send(company, templateMessage)).catch(err => {
                return applicationsChannel.send(err)
            });
        responseMessage += `${company.name} | ${company.link}\n`
    }

    return applicationsChannel.send(responseMessage);

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

    /**@param {Message} message*/
    function messageToCompanies(message) {
        return message.content.split('\n').map(companyInfo => {
            if (companyInfo.startsWith('**')) return null;
            let [name, email] = companyInfo.split('|');
            name = name.substring(0, name.length - 1);
            email = email.substring(1);
            return new Company(name, email, message.createdAt.getMonth());
        }).filter(v => v);
    }
    /**@returns {Promise<Company[]>} */
    async function getCompanies() {
        let companiesChannel = await getChannel(testingMode ? 'companies-test' : 'companies');
        if (!companiesChannel) return null;

        let messages = await companiesChannel.messages.fetch();
        return messages.map(m => messageToCompanies(m)).reduce((result, companyArr) => result.concat(...companyArr), []);
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
            bcc: testingMode ? null : 'Ansoegningdata@techcollege.dk',
            subject: "Datatekniker m. speciale i programmering",
            text: message.content.replace('$name$', company.name),
            attachments: message.attachments.map(a => { return { filename: a.name, path: a.url } })
        }
    }
}

/**@param {number} month*/
function getMonthString(month) {
    return [
        "Janurary", "February",
        "March", "April", "May",
        "June", "July", "August",
        "September", "October", "November",
        "December"
    ][month];
}

/*
 * https://developers.google.com/oauthplayground/
 * OAuth 2.0 Configuration => Use your own OAuth credentials => Client ID & Secret from config.json
 * Select & authorize APIs: Gmail API v1 => https://mail.google.com/ => Authorize APIs
 * Login using danielsimonsen90@gmail.com & authorize the app
 * Click Exchange authorization code for tokens
 * Replace config.mail.refreshToken for the provided token
 */