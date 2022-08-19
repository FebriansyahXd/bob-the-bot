"use strict";
const {
	default: makeWASocket,
	BufferJSON,
	initInMemoryKeyStore,
	DisconnectReason,
	AnyMessageContent,
    makeInMemoryStore,
	useSingleFileAuthState,
	delay
} = require("@adiwajshing/baileys")
const  { Boom } = require('@hapi/boom')
const figlet = require("figlet");
const fs = require("fs");
const chalk = require('chalk')
const logg = require('pino')
const clui = require('clui')
const { Spinner } = clui
const moment = require('moment');
const { serialize } = require("./lib/function");
const { color, mylog, infolog } = require("./lib/color");
const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')
const setting = JSON.parse(fs.readFileSync('./satset.json'));
const { groupResponse } = require('./message/group.js')
const session = `./${setting.sessionName}.json`
const { state, saveState } = useSingleFileAuthState(session)

    if (time < "24:59:00") {
      var ucapanWaktu = "Selamat malam🌌";
    }
    if (time < "19:00:00") {
      var ucapanWaktu = "Selamat senja🌞";
    }
    if (time < "18:00:00") {
      var ucapanWaktu = "Selamat sore🌄";
    }
    if (time < "15:00:00") {
      var ucapanWaktu = "Selamat siang☀️";
    }
    if (time < "11:00:00") {
      var ucapanWaktu = "Selamat pagi🌅";
    }
    if (time < "05:00:00") {
      var ucapanWaktu = "Selamat malam🌃";
    }
    
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}    
    
let spc1 = ' '
let spc2 = '\n              '
let spc3 = '           '
let spc4 = '  '

function title() {
      console.clear()    
      console.log('\x1b[1;31m×\x1b[1;37m>', '<\x1b[1;32m📍︎\x1b[1;37m>', color('connect to'), 'whatsaapweb')	
	  console.log(color(figlet.textSync(`${spc2}Zee-MD`, {
        font: 'Standard',
        horizontalLayout: 'default',
        vertivalLayout: 'default',
        width: 80,
        whitespaceBreak: false
        }), 'aqua'))        		  	  
	  console.log(color(`${spc2}[ • PENGGUNA BOT ${setting.ownerName} • ]` ,'white'))
	  console.log(color(`${spc4}< ================================================== >`, 'cyan'))
	  console.log(color(`${spc3}[•]`, 'aqua'), color(`Hai          : ${ucapanWaktu}`, 'yellow'))
	  console.log(color(`${spc3}[•]`, 'aqua'), color(`Bot Version : 2.1.2`, 'lime'))
	  console.log(color(`${spc3}[•]`, 'aqua'), color(`Status       : Online!`, 'white'))
	  console.log(color(`${spc3}[•]`, 'aqua'), color(`Owner       : ${setting.ownerName}`, 'red'))
	  console.log(color(`${spc3}[•]`, 'aqua'), color(`Devoloper    : @Pebri_Elja`, 'magenta'))
	  console.log(color(`${spc4}< ================================================== >`, 'cyan'))
}

/**
* Uncache if there is file change;
* @param {string} module Module name or path;
* @param {function} cb <optional> ;
*/
function nocache(module, cb = () => { }) {
	console.log(color(`Module ${module} sedang diperhatikan terhadap perubahan`, 'aqua'))
	fs.watchFile(require.resolve(module), async () => {
		await uncache(require.resolve(module))
		cb(module)
	})
}
/**
* Uncache a module
* @param {string} module Module name or path;
*/
function uncache(module = '.') {
	return new Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(module)]
			resolve()
		} catch (e) {
			reject(e)
		}
	})
}

const status = new Spinner(chalk.cyan(` Booting WhatsApp Bot`))
const starting = new Spinner(chalk.cyan(` Preparing After Connect`))
const reconnect = new Spinner(chalk.redBright(` Reconnecting WhatsApp Bot`))

const store = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

const ZeeConnect = async () => {
	const conn = makeWASocket({
            printQRInTerminal: true,
            //logger: logg({ level: 'fatal' }),
            logger: logg({ level: 'silent' }),
            auth: state,
            browser: ["Zee", "Safari", "3.0"]
        })
	    title()
        store.bind(conn.ev)
	
	/* Auto Update */
	require('./message/msg')
    nocache('./message/msg', module => console.log(chalk.greenBright(' ✓ ') + time + chalk.cyanBright(` "${module}" update!`)))
	
	conn.multi = false
	conn.nopref = false
	conn.prefa = '/'
	conn.ev.on('messages.upsert', async m => {
		if (!m.messages) return;
		var msg = m.messages[0]
		msg = serialize(conn, msg)
		msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
		require('./message/msg')(conn, msg, m, setting, store, ucapanWaktu)
	})
	
   conn.ev.on('group-participants.update', async (update) =>{
   groupResponse(conn, update)
   console.log(update)
   })         
   
	
	   conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update	    
        if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
            if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); process.exit(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); ZeeConnect(); }
            else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); ZeeConnect(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); process.exit(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Delete Session and Scan Again.`); process.exit(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); ZeeConnect(); }
            else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); ZeeConnect(); }
            else { console.log(`Unknown DisconnectReason: ${reason}|${connection}`) }
        }
        //await sleep(100000000);
        console.log(update)
       // console.log('Lagi ngeload session cooo, sabarr',)
        //await sleep(1000);
    })
	
	conn.ev.on('creds.update', () => saveState)
	
	conn.reply = (from, content, msg) => conn.sendMessage(from, { text: content }, { quoted: msg })

	return conn
	
}

ZeeConnect()
.catch(err => console.log(err))