const Discord = require('discord.js');
const fs = require('fs')
const client = new Discord.Client('');
var prefix = "+";

client.login(process.env.TOKEN);

client.on('ready', function () {
 console.log('Bot Connected')
    client.user.setGame(`Kingdom System ( Prefix: + )`,"http://twitch.tv/Death Shop")
})


const warns = JSON.parse(fs.readFileSync('./warns.json'))




client.on('guildMemberAdd', member => {
    let embed = new Discord.RichEmbed()
        .setDescription('  **Hello** ' + member.user.username + ', **Welcome to Kingdom** , **We are now** ' + member.guild.memberCount + ' **Members** ! :heart: ')
    member.guild.channels.get('605438284151128065').send(embed)
});



/*Kick */
client.on('message', message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if(args[0].toLowerCase() === prefix + 'kick'){
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(" **You dont have the permission to use this commande** ||Al 7mar|| ")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send(" **Please Mention a user** !")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send(":Crown: **You do not have the permission to Kick this member**")
        if (!member.kickable) return message.channel.send("  **I C'ant Kick This Member** !")
        member.kick()
        message.channel.send(member.user.username +' **Has Been Kicked From The Server** ')
    }
})

/*Ban */
client.on('message', message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if(args[0].toLowerCase() === prefix + 'ban'){
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(" **You dont have the permission to use this commande** ||Al 7mar|| ")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("**Please Mention a user** !")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send(":Crown: **You do not have the permission to Bannir this member**")
        if (!member.bannable) return message.channel.send(" **I C'ant Ban This Member** !")
        message.guild.ban(member, {days : 7})
        message.channel.send(member.user.username +' **Has Been Banned From The Server** ')
    }
})



client.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)


        /*Clear */
    if (args[0].toLowerCase() === prefix + "clear"){
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("  **You dont have the permission to use this commande** ||Al 7mar|| ")
        let count =  args[1]
        if (!count) return message.channel.send(" **Please choose a number of messages to delete** :x: ")
        if (isNaN(count)) return message.channel.send(" **Please choose a number from** **1** **to** **100** ")
        if (count < 1 || count > 100) return message.channel.send(" **Please choose a number from** **1** **to** **100**")
        message.channel.bulkDelete(parseInt(count) +1)
    }


    /*Mute */
    if (args[0].toLowerCase() === prefix + "mute") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("  **You dont have the permission to use this commande** ||Al 7mar|| ")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send(" **Sorry but I can't found this Member** ")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send(" **You can't mute this member** :triumph: ")
        if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id == message.guild.ownerID) return message.channel.send("**Sorry i can't mute this member** :tired_face: ")
        let muterole = message.guild.roles.find(role => role.name == 'Muted')
        if  (muterole) {
            member.addRole(muterole)
            message.channel.send( member + " **Has been muted** :zipper_mouth: ")
        }
        else {
            message.guild.createRole({name : 'Muted', permissions: 0}).then((role) => {
                message.guild.channels.filter(channel => channel.type === 'text').forEach(channel => {
                    channel.overwritePermissions(role, {
                        SEND_MESSAGES : false
                    })
                })
                member.addRole(role)
            message.channel.send(member + " **Has been muted** :zipper_mouth: ")
            })
        }
    }
})


client.on('message', message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    /*Warn */
    if (args[0].toLowerCase() === prefix + "warn") {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("  **You dont have the permission to use this commande** ||Al 7mar|| ")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send(": **Please Mention a user** !")
        if (member.highestRole.comparePositionTo(message.member.highestRole) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send(" **You do not have the permission to Warn this member**")
        let reason = args.slice(2).join(' ')
        if (!reason) return message.channel.send(" **You need a reason to warn this player** :red_circle:  ")
        if (!warns[member.id]) {
            warns[member.id] = []
        }
        warns[member.id].unshift({
            reason: reason,
            date: Date.now(),
            mod: message.author.id
        })
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
        message.channel.send( member + " **Has been warned reason** :" + reason + " :warning: ")
    }
    /*List Warn */
    if (args[0].toLowerCase() == prefix + "lwarn") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("  **You dont have the permission to use this commande** ||Al 7mar|| ")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send(" **Please Mention a user** !")
        let embed = new Discord.RichEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .addField(" **Last Warns** ", ((warns[member.id]) ? warns[member.id].slice(0, 10).map(e => e.reason) : "**This Member Have no Warn"))
            .setTimestamp()
        message.channel.send(embed)
    }

    /*UnMute */
    if (args[0].toLocaleLowerCase() == prefix + "unmute") {
        let member = message.mentions.members.first()
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("  **You dont have the permission to use this commande** ||Al 7mar|| ")
        if(!member) return message.channel.send(" **Sorry I Can't found this member** :disappointed_relieved: ")
        if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send(" **You Can't Unmute this member** :expressionless: ")
        if(member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send(" **Sorry I Can't Unmute this member** :cry: ")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if(muterole && member.roles.has(muterole.id)) member.removeRole(muterole)
        message.channel.send( member + " **Has Been Unmuted** :thinking: ")
    }

    
    //unwarn
      if (args[0].toLowerCase() === prefix + "clw") {
        let member = message.mentions.members.first()
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(" **You dont have the permission to use this commande** ||Al 7mar|| ")
        if(!member) return message.channel.send(" **Sorry I Can't found this member** :disappointed_relieved: ")
        if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send(" **You Can't Unwarn this member** :expressionless: ")
        if(!member.manageable) return message.channel.send(" **Sorry I Can't Unwarn this member** :cry: ")
        if(!warns[member.id] || !warns[member.id].length) return message.channel.send(" **This member have no warns** ")
        warns[member.id].shift()
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
        message.channel.send("**Last Warn for** " + member + " **Has been deleted** :grin:  ")
    }
});


