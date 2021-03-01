const { Collection } = require('discord.js');
const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('resettheme', 'GuildSpecific', `Resets theme in Deadly Ninja`, {
    permissions: ["MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_GUILD"],
    guildOnly: true,
    specificGuildID: '405763731079823380'
}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {
        if (!message.member.roles.cache.has('497439032138006530') || message.author.id == '361815289278627851')
            return message.channel.send(`Only cool people have access to this command!`);
        let adminCheck = PinguLibrary.PermissionCheck({
            author: client.user,
            channel: message.channel,
            client,
            content: message.content
        }, 'ADMINISTRATOR');
        if (adminCheck != PinguLibrary.PermissionGranted) return message.channel.send(`Gib me the **eye**`);

        const channels = message.guild.channels.cache.sort((a, b) => a.position < b.position);
        const roles = message.guild.roles.cache.sort((a, b) => a.position < b.position);
        const deadlyNinja = {
            iconURL: message.guild.iconURL(),
            name: message.guild.name
        };

        const reason = `Theme reset requested by ${message.author.tag}`;

        await (async function setChannels() {
            const defaultChannles = (function setDefaultChannels() {
                let collection = new Collection();

                (function setInformation() {
                    collection.set('629308933340921856', '👓 Information 👓');
                    collection.set('752563633464017016', 'rules-ig📜');
                    collection.set('472484901237686292', 'announcements📢');
                    collection.set('646736836861100043', 'themes🎭');
                    collection.set('781087883259543563', 'themes-log🎭');
                    collection.set('788056918421798994', 'giveaways🎁');
                    collection.set('472483818893344779', 'door-idk🚪');
                    collection.set('505809025221525525', 'promotions🎥');
                    collection.set('639546268410052609', 'roles🤷🏼');
                    collection.set('761266999279878154', 'how-to-get-roles❔');
                    collection.set('755088361584066632', 'reddit-suggestions🧐');
                })();
                (function setChats() {
                    collection.set('405763731713425419', '⌨ Chats 💬');
                    collection.set('405763731713425420', 'general-chat💬');
                    collection.set('477214451683295291', 'motd🌞');
                    collection.set('485532271319842825', 'quotes📌');
                })();
                (function setVoiceChannels() {
                    collection.set('405763731713425421', '🗣Voice Channels👥');
                    collection.set('652197369865175041', 'tts😶');
                    collection.set('405763731713425422', 'Chillin');
                    collection.set('721110569050046504', 'Party Corner');
                    collection.set('802258274291417109', 'Sad Corner');
                    collection.set('689391865023299682', `Bica's Corner`);
                    collection.set('796029341913972806', 'Tax Payers');
                    collection.set('801101138043863080', 'Women Gaymers');
                    collection.set('475616873115811860', 'Schleepy💤');
                })();
                (function setBotSpam() {
                    collection.set('472714293012332554', '🤖 Bot Spam 👾');
                    collection.set('641887302418956318', 'daily-spam🌅');
                    collection.set('474129152065273866', 'bot-spam🤖');
                    collection.set('655020851216908289', 'music-bots📻');
                    collection.set('472484741023531012', 'memes😂');
                })();
                (function setPrivateChannels() {
                    collection.set('652207743880527886', '🤫 Private Channels 🔐');
                    collection.set('640321758406115358', 'boosters💎');
                    collection.set('761174645457158154', 'brorzmandskabet-gang-gang🤬');
                    collection.set('651048822117629952', 'h2-boiz🏫');
                    collection.set('796029498578698300', 'kids-chat👶');
                    collection.set('641214258025070602', 'skp-bois💻');
                    collection.set('724569729225719888', 'tweekatv🕺🏽');
                    collection.set('635548726487810055', 'uwu-whats-this🤏🏼🍆');
                    collection.set('641215175931723797', 'weeb-trashes🗼');

                    collection.set('760145289956294716', `Danhoe's Dungeon that kinda smells like coffee..?☕`);
                    collection.set('774168229005230100', 'SKP At Home');
                    collection.set('646441103523840050', 'Time Out Corner');
                    collection.set('405808852991475722', 'Under 4 ears');
                    collection.set('405809884265971723', 'Threesome');
                    collection.set('405846730005807110', 'Foursome');

                })();
                (function setGamingChannels() {
                    collection.set('473158504874508318', '🖥 Gaming Channels ⌨');
                    collection.set('777323885884342282', 'aqw-grind🐌');
                    collection.set('814885150504124426', 'cod-cold-war🥶');
                    collection.set('745351317412905112', 'fall-guys👑');
                    collection.set('799070160458874950', 'genshin-impact🌠');
                    collection.set('476051063502274560', 'gta🏎');
                    collection.set('474511736213340180', 'mineqwaft⛏');
                    collection.set('473422442656825346', 'overwatch🕓');
                    collection.set('768906794029285406', 'phasmophobia👻');
                    collection.set('734884680439955499', 'pixelspark-bois🐭');

                    collection.set('473422577210228746', '— Seperator —');
                    collection.set('626836542857412628', '🏎 GTA 🏎');
                    collection.set('405764753655463947', '⛏ Minecraft ⛏');
                    collection.set('405790616669257760', '🕓 Overwatch 🕓');
                    collection.set('768906942478680084', '👻 Phasmophobia 👻');
                })();
                (function setCommunityEvents() {
                    collection.set('753574090052206712', '🧍🏽Community Events👥');
                    collection.set('753565780641054730', 'community-event-hosts🤵🏻');
                    collection.set('753574175062491167', 'participants-chat💬');
                    collection.set('753574844284534845', 'participants-announcements📢');
                    collection.set('756845490716540938', 'Participant Voicechat');
                })();
                (function setManagement() {
                    collection.set('752613523858784264', '🔧 Management 🕵🏼');
                    collection.set('651046560863354891', 'big-boi-place🤵🏻');
                    collection.set('752613635179675648', 'logs📝');
                    collection.set('752613661800923147', 'bot-updates🔔');
                    collection.set('801030503531806720', 'bot-status🔔');
                })();
                (function setBigBoiGrouping() {
                    collection.set('752571680089702522', '🧍🏽 Big Boi Grouping 👫🏽');
                    collection.set('752571743016583350', 'owo-whots-dis');
                    collection.set('752572242805653709', 'management-grouping');
                    collection.set('752572272778149908', 'personal-grouping');
                    collection.set('752572303983771770', 'group-grouping');
                    collection.set('752572358157402143', 'gaming-grouping');
                    collection.set('761231609314672660', 'hypesquad-grouping');
                    collection.set('752572386640920646', 'level-grouping');
                })();
                return collection;
            })();
            for (var item of defaultChannles) {
                let id = item[0], name = item[1];

                let currentChannel = channels.get(id);
                if (!currentChannel || currentChannel.name == name) continue;

                await currentChannel.setName(name, reason);
            }
        })();
        await (async function setRoles() {
            const defaultRoles = (function setDefaultRoles() {
                let collection = new Collection();
                class Role {
                    /**@param {string} name
                     * @param {string | number} color*/
                    constructor(name, color) {
                        this.name = name;
                        this.color = color;
                    }
                }

                (function setManagement() {
                    collection.set('549611213374488578', new Role("—=—=— Managment Roles —=—=—", 0));
                    collection.set('762403363727736844', new Role("Creator", '#b99bf3'));
                    collection.set('672100455127711774', new Role("Theme Winner", '#ff75fa'));
                    collection.set('699870814421516301', new Role("Big Boi", '#fab54b'));
                    collection.set('497439032138006530', new Role("Slaves with Perms", 0));
                    collection.set('682547571721371679', new Role("All-Seeing Eye", 0));
                    collection.set('720894710092267550', new Role("HAdmins", 0));
                    collection.set('691624820269383690', new Role("Admins", 0));
                    collection.set('753565240255578254', new Role("Community Event-hosts", 0));
                    collection.set('719521607189790790', new Role("Giveaways", 0));
                })();
                (function setPersonal() {
                    collection.set('752520063679987732', new Role("—=—=— Personal Roles —=—=—", 0));
                    collection.set('719882559562973195', new Role("Giveaway Winner", '#d9a760'));
                    collection.set('755766216701771776', new Role("Flyttemand m. speciale i IT", '#ffed00'));
                    collection.set('778528112748396554', new Role("Mr. Nice Guy", '#000001'));
                    collection.set('800995896048746506', new Role("OMNOM", '#b900ff'));
                    collection.set('765700083890257940', new Role("An Actual Demon", '#811919'));
                    collection.set('761174118946701373', new Role("Brorzmandskabsleder", '#f3f3f3'));
                    collection.set('801837541945769985', new Role("Autism", '#e3a1ff'));
                    collection.set('716613307624062977', new Role("Dad", '#4671b5'));
                    collection.set('802955952361308211', new Role("The Best Little Sister", '#a2bcff'));
                    collection.set('737073804890734654', new Role("DiscordM", '#aefff4'));
                    collection.set('756406381904396288', new Role("Elektrikker pleb", '#ff00d9'));
                    collection.set('800476348995993650', new Role("Member #69", '#ff00de'));
                    collection.set('773524857001476096', new Role("Mwoah Gertje", '#2ECC71'));
                    collection.set('754454781178806422', new Role("Pin this BITCh", 0));
                    collection.set('754454781178806422', new Role("Professional Fortnite Gaymer", '#71368A'));
                    collection.set('796001764260053002', new Role("Shtoje", '#F1C40F'));
                    collection.set('756562029271318530', new Role("Test Subject", '#F1C40F'));
                    collection.set('804324247287496755', new Role("The Grinder", '#ff00ed'));
                    collection.set('796692899970416640', new Role("Unrespectable Gamer", '#7359B6'));
                })();
                (function setGrouping() {
                    collection.set('639558744887263232', new Role("—=—=— Group Roles —=—=—", 0));
                    collection.set('753573748279345182', new Role("Community Event Participants", '#1F8B4C'));
                    collection.set('791368426522017792', new Role("Active Chatter", '#09ff00'));
                    collection.set('791368683933925407', new Role("Active Talker", '#09ff00'));
                    collection.set('639191645560111119', new Role("Booster Bois", '#00ffff'));
                    collection.set('761173928198012948', new Role("Brorzmandskabet", '#6273c2'));
                    collection.set('772804441203933194', new Role("Content Creator", '#9147ff'));
                    collection.set('803247641035014175', new Role("Danhoe Family", '#ff5e00'));
                    collection.set('651046415161622528', new Role("Datatekniker m. Specialer", '#81553c'));
                    collection.set('736608812307316868', new Role("Fuck-Off Boomer Gang", '#95A5A6'));
                    collection.set('796027540136656946', new Role("Kids", '#ffa7ef'));
                    collection.set('720895938163376128', new Role("Krævende Lillesøster", '#ff00ca'));
                    collection.set('641213873948590101', new Role("IT-Fattehoved", '#06b12c'));
                    collection.set('631563372428787735', new Role("Pornhub Premium paid by Mommy", '#F1C40F'));
                    collection.set('707891197045112922', new Role("Red Circle", '#c90000'));
                    collection.set('760822983848755221', new Role("SKP Bois", '#F1C40F'));
                    collection.set('773087069395484683', new Role("Still Sword Staff", '#3e70dd'));
                    collection.set('724517363281690686', new Role("Tweeka Family", '#8c00ff'));
                    collection.set('504717717731934229', new Role("Weebs", '#a641f7'));
                    collection.set('801101308887040032', new Role("woman ?", '#979C9F'));
                })();
                (function setGaming() {
                    collection.set('473425222171754516', new Role("—=—=— Gaming Roles —=—=—", 0));
                    collection.set('777324002167226368', new Role("Adventure Quest Worlds", '#ff00f1'));
                    collection.set('777328478269341726', new Role("Call of Duty - Cold War", '#F1C40F'));
                    collection.set('745350886208831498', new Role("Fall Guy Gang", '#e72e2e'));
                    collection.set('794951298062745620', new Role("Genshin Impact", '#AD1457'));
                    collection.set('476050602720231435', new Role("GTA", '#fc2727'));
                    collection.set('711355295250513950', new Role("SoulSilver Bois", '#95A5A6'));
                    collection.set('738470298709393468', new Role("HeartGolderz", '#e3b353'));
                    collection.set('494753197076905995', new Role("Minequafters", '#59ec88'));
                    collection.set('405790775188783107', new Role("Overwatchers", '#ffb20e'));
                    collection.set('768906510012383242', new Role("Phasmophobia", '#f0f0f0'));
                    collection.set('693463550001283113', new Role("WoW", '#070707'));
                })();
                (function setHypeSquad() {
                    collection.set('761230842646495254', new Role("—=—=— HypeSquad Role —=—=—", 0));
                    collection.set('761231002071728138', new Role("HypeSquad Balance", '#45ddc0'));
                    collection.set('761231195866267659', new Role("HypeSquad Bravery", '#9c84ef'));
                    collection.set('761231124084031488', new Role("HypeSquad Brilliance", '#f47b67'));
                })();
                (function setBots() {
                    collection.set('472735837923180544', new Role("—=—=— Bots —=—=—", 0));
                    collection.set('647354744528175145', new Role("Billy the Boomer [b!]", '#54663a'));
                    collection.set('769528191592431638', new Role("Cryptic [!]", '#99c4f2'));
                    collection.set('473583058268979200', new Role("Dank Memer [pls]", '#1F8B4C'));
                    collection.set('505806408810233866', new Role("GiveawayBot [g!]", '#F1C40F'));
                    collection.set('710093698385576026', new Role("Groovy [-]", '#71368A'));
                    collection.set('776958941384409128', new Role("Groovy 2 [--]", '#ff50fd'));
                    collection.set('472130394326564864', new Role("Mee6 [!]", '#3e70dd'));
                    collection.set('641886780345417732', new Role("Miki [>]", '#E67E22'));
                    collection.set('746726375326613605', new Role("Mudae [$]", 0));
                    collection.set('746728547560718367', new Role("Mudamaid 22 [$]", 0));
                    collection.set('796647920593141761', new Role("NordBot [+]", 0));
                    collection.set('646349988632199188', new Role("Pingu [*]", '#3e70dd'));
                    collection.set('804253990564790285', new Role("Pingu BETA [b*]", '#206694'));
                    collection.set('566716709407293443', new Role("Pokecord [p!]", '#ff0000'));
                    collection.set('639546087459520563', new Role("ReactionRoles [rr!]", '#7359B6'));
                    collection.set('475216278760456205', new Role("Rythm [r!]", '#F1C40F'));
                    collection.set('644176061428400148', new Role("Slothbot [$$]", '#864b00'));
                    collection.set('785487997378363453', new Role("Sorte Carlo [c!]", '#020202'));
                    collection.set('791366187954208799', new Role("Statbot [s?]", '#2ECC71'));
                    collection.set('756998987311218758', new Role("I can play music", 0));
                    collection.set('768804743975141418', new Role("I have memes", 0));
                    collection.set('798070119778746410', new Role("Use me daily", 0));
                    collection.set('756627873904721992', new Role("Muted", '#818386'));
                })();
                (function setLevels() {
                    collection.set('473172300884213780', new Role("—=—=— Mee6 Level Role —=—=—", 0));
                    collection.set('640187667237175297', new Role("Invincible!", '#ff54f2'));
                    collection.set('640187541252997123', new Role("Reborn o:", '#d377ff'));
                    collection.set('640184863961514008', new Role("UNKNOWN TO HUMANITY", '#8d77ff'));
                    collection.set('473534932732477462', new Role("Ghost", '#4faaff'));
                    collection.set('473534858287775754', new Role("Dead", '##4ee8ff'));
                    collection.set('487944480205307904', new Role("Old fuck", '#08ffc5'));
                    collection.set('487944159395708930', new Role("Boomer", '#81ff52'));
                    collection.set('473534720496631828', new Role("Adult", '#fffb00'));
                    collection.set('472409202392825877', new Role("Young Adult", '#ff8400'));
                    collection.set('473534231633723422', new Role("Teen", '#db0000'));
                    collection.set('473533953287127061', new Role("Child", '#161616'));
                    collection.set('472482274974236676', new Role("Toddler", '#525252'));
                    collection.set('473533755919695882', new Role("Baby", '#b3b3b3'));
                    collection.set('472416813154697216', new Role("Fetus", '#ffffff'));
                })();
                return collection;
            })();
            for (var item of defaultRoles) {
                let id = item[0], role = item[1];

                let currentRole = roles.get(id);
                if (!currentRole || currentRole.name == role.name && (typeof role.color == 'string' && currentRole.hexColor == role.color || currentRole.color == role.color)) continue;

                if (currentRole.name != role.name) await currentRole.setName(role.name, reason);
                if (typeof role.color == 'string' && currentRole.hexColor != role.color || currentRole.color != role.color) await currentRole.setColor(role.color, reason);
            }
        })();
        await (async function setDefaults() {
            const defaultDeadlyNinja = {
                iconURL: 'https://cdn.discordapp.com/attachments/773807780883726359/814779401350676480/Deadly_Ninja.JPG',
                name: "Deadly Ninja"
            };

            if (deadlyNinja.iconURL != defaultDeadlyNinja.iconURL) await message.guild.setIcon(defaultDeadlyNinja.iconURL, reason);
            if (deadlyNinja.name != defaultDeadlyNinja.name) await message.guild.setName(defaultDeadlyNinja.name, reason);
            if (message.guild.splashURL() != defaultDeadlyNinja.iconURL) await message.guild.setSplash(defaultDeadlyNinja.iconURL, reason);
        })();

        return message.channel.send(`May **${deadlyNinja.name}** only live in our memories...`);
})