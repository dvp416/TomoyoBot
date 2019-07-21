const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const Sequelize = require('sequelize');
const client = new Discord.Client();

//Message Parsing vars
var hasMore;
var msgCopy, msgSlice;
var emoteStart, emoteEnd;

//SQL database stuff
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	operatorsAliases: false,
	// SQLite only
	storage: 'database.sqlite',
});

//Table model
const Emotes = sequelize.define('emotes', {
	name:{
		type:Sequelize.STRING,
		unique:true,
	},
	use_count:{
		type: Sequelize.INTEGER,
		defaultValue: 1,
		allowNull: false,
	},

});


//Bot is active and running
client.once('ready', () => {
	console.log('Ready!');
	Emotes.sync();
});

//When a message is recieved
client.on('message', async message => {
	//console.log(message.content);
  if (message.content.startsWith(`${prefix}server`)){
    message.channel.send(`Server name: ${message.guild.name}`);
  }
	//Returns list of all recorded emotes
	else if (message.content.startsWith(`${prefix}emotes`)){
		//const emoList = await Emotes.findAll({attributes: ['name', 'use_count']});
		const emoList = await Emotes.findAll()
		const emoString = emoList.map(t => t.name + t.use_count).join('\n') || 'No emotes recorded';
		return message.channel.send(`List of Emotes: \n${emoString}`);
	}

	//detects if message contains a CUSTOM emoji
	else if(message.content.includes('<:')){
		hasmore = 1;
		msgCopy = message.content;

		//parses and removes each custom emote from the Message
		while (hasmore == 1){
			emoteStart = msgCopy.indexOf('<:');
			emoteEnd = msgCopy.indexOf('>');
			msgSlice = msgCopy.slice(emoteStart, emoteEnd+1);
			msgCopy = msgCopy.replace(msgSlice, 'emote');

			//try to create a table for the read emote
			try{
				const emo = await Emotes.create({
					name: msgSlice,
				});
				//console.log('Created: ' + msgSlice);
			}
			//Increment the count for the read emote
			catch(e){
				if (e.name === 'SequelizeUniqueConstraintError'){
					const emo2 = await Emotes.findOne({ where: { name: msgSlice } });
					if (emo2) {
						emo2.increment('use_count');
						//console.log('Incremented: ' + msgSlice);
					}
				}
			}

			//check if there are more custom emotes
			if (msgCopy.indexOf('<:') == -1){
				hasmore = 0;
			}
		}
		//console.log(msgCopy);
	}

});

client.login(token);
