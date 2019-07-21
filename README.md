# TomoyoBot
Discord Chatbot

Howdy!
This is a simple Discord Chatbot I've implemented using Javascript, the Discord.js API, and Sequelize.
TomoyoBot is a custom emote management bot. She records all custom emotes and stores them in an sqlite database along with their total usage count.

Commands:
;server		Returns the current server name in chat. Simple test command.
;emotes		Returns the list of all recorded emotes and their usage count since TomoyoBot started recording.
			*IMPORTANT* Counts will be slightly inflated becase TomoyoBot counts the emotes returned in the list.
			Don't spam this emote if you want it to be accurate.
