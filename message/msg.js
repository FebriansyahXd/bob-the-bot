"use strict";

process.on('uncaughtException', console.error) 

const {
	downloadContentFromMessage
} = require("@adiwajshing/baileys")
const { color, bgcolor } = require('../lib/color')
const { formatp, getBuffer, fetchJson, fetchText, getRandom, getGroupAdmins, runtime, sleep, makeid } = require("../lib/function");
const { pinterest } = require("../lib/pinterest")

const { tafsir_mimpi, arti_nama, kecocokan_nama_pasangan } = require('../lib/primbon') 
const fs = require ("fs");
const os = require('os');
require('./config')
const Jimp = require('jimp')
const yts = require("yt-search");
const ytdonglot = require("../lib/ytdl");
const xfar = require('xfarr-api');
const hx = require("hxz-api")
const moment = require("moment-timezone");
const util = require("util");
const { exec, spawn } = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const speed = require("performance-now");
const request = require("request");
const ms = require("parse-ms");
const time = moment().tz("Asia/Makassar").format("HH:mm:ss");
const figlet = require("figlet");

// Exif
const Exif = require("../lib/exif")
const exif = new Exif()

const reSize = async(buffer, ukur1, ukur2) => {
    return new Promise(async(resolve, reject) => {
        var baper = await Jimp.read(buffer);
        var ab = await baper.resize(ukur1, ukur2).getBufferAsync(Jimp.MIME_JPEG)
        resolve(ab)
    })
}


moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async(conn, msg, m, setting, ucapanWaktu) => {
	try {
		let { ownerNumber, botName, ownerName } = setting
		let { allmenu } = require('./command')
		const { type, quotedMsg, mentioned, now, fromMe } = msg
		if (msg.isBaileys) return
		const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
		let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
		const content = JSON.stringify(msg.message)
		const from = msg.key.remoteJid
		
		const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') ? msg.message.imageMessage.caption : (msg.type == 'videoMessage') ? msg.message.videoMessage.caption : (msg.type == 'extendedTextMessage') ? msg.message.extendedTextMessage.text : (msg.type == 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : (msg.type == 'listResponseMessage') ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (msg.type == 'templateButtonReplyMessage') ? msg.message.templateButtonReplyMessage.selectedId : (msg.type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId || msg.text) : ''
	
		const toJSON = j => JSON.stringify(j, null,'\t')
		
		if (conn.multi) {
			var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
		} else {
			if (conn.nopref) {
				prefix = ''
			} else {
				prefix = conn.prefa
			}
		}
		const args = chats.split(' ')
		const command = chats.toLowerCase().split(' ')[0] || ''
		const isCmd = command.startsWith(prefix)
		const isGroup = msg.key.remoteJid.endsWith('@g.us')
		const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
		const isOwner = ownerNumber.includes(sender)
		const pushname = msg.pushName
		const q = chats.slice(command.length + 1, chats.length)
		const body = chats.startsWith(prefix) ? chats : ''		
		const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
		const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const groupId = isGroup ? groupMetadata.id : ''
		const groupMembers = isGroup ? groupMetadata.participants : ''
		const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
		const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
		const isGroupAdmins = groupAdmins.includes(sender)

		const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
                const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
                const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
                mention != undefined ? mention.push(mentionByReply) : []
                const mentionUser = mention != undefined ? mention.filter(n => n) : []
		
		async function downloadAndSaveMediaMessage (type_file, path_file) {
			if (type_file === 'image') {
				var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'video') {
				var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'sticker') {
				var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'audio') {
				var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			}
		}
        
		const isUrl = (url) => {
			return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
		}
		function jsonformat(string) {
            return JSON.stringify(string, null, 2)
        }
		function monospace(string) {
            return '```' + string + '```'
        }
		function randomNomor(min, max = null) {
		  if (max !== null) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min;
		  } else {
			return Math.floor(Math.random() * min) + 1
		  }
		}
		const pickRandom = (arr) => {
			return arr[Math.floor(Math.random() * arr.length)]
		}
		function mentions(teks, mems = [], id) {
			if (id == null || id == undefined || id == false) {
			  let res = conn.sendMessage(from, { text: teks, mentions: mems })
			  return res
			} else {
		      let res = conn.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
		      return res
 		    }
		}
		const reply = (teks) => {
			conn.sendMessage(from, { text: teks }, { quoted: msg })
		}
 
        		
		const textImg = (teks) => {
			return conn.sendMessage(from, { text: teks, jpegThumbnail: fs.readFileSync(setting.pathimg) }, { quoted: msg })
		}		
		const sendMess = (hehe, teks) => {
			conn.sendMessage(hehe, { text, teks })
		}
		const buttonWithText = (from, text, footer, buttons) => {
			return conn.sendMessage(from, { text: text, footer: footer, templateButtons: buttons })
		}
		const sendContact = (jid, numbers, name, quoted, mn) => {
			let number = numbers.replace(/[^0-9]/g, '')
			const vcard = 'BEGIN:VCARD\n' 
			+ 'VERSION:3.0\n' 
			+ 'FN:' + name + '\n'
			+ 'ORG:;\n'
			+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
			+ 'END:VCARD'
			return conn.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
		}

//fake		
const tamnel = await reSize(`./pp.png`, 200, 200) 
		
		const flokasi = {key : {
 participant : '0@s.whatsapp.net'
},
message: {
locationMessage: {
name: global.namebot,
jpegThumbnail: fs.readFileSync('./pp.png')
}
}
}
		
		const fake = {key: { fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: `41798898139-1429460331@g.us` } : {}) },message: { "imageMessage": { "title":`${botName}\n${dt} ${pushname !== undefined ? pushname : `Kak`} 👋`, "h": `Hmm`,'seconds': '10000000⁰0', 'caption': `${botName}\n${dt} ${pushname !== undefined ? pushname : `Kak`} 👋`, 'jpegThumbnail': fs.readFileSync('./pp.png')}}}
		
		
		const buttonsDefault = [
			//{ callButton: { displayText: `Call Owner!`, phoneNumber: `+6285849261085` } },
			{ urlButton: { displayText: `github!`, url : `https://github.com/FebriansyahXd` } },
			{ quickReplyButton: { displayText: `🧑 owner`, id: `${prefix}owner` } },
			{ quickReplyButton: { displayText: `💰 donate`, id: `${prefix}donate` } },
			{ quickReplyButton: { displayText: `🗼 ping bot`, id: `${prefix}pingbot` } }
		]
        
		const isImage = (type == 'imageMessage')
		const isVideo = (type == 'videoMessage')
		const isSticker = (type == 'stickerMessage')
		const isQuotedMsg = (type == 'extendedTextMessage')
		const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
		const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
		const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
		const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
		const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false

		// Auto Read & Presence Online
		//conn.sendReadReceipt(from, sender, [msg.key.id])
		//conn.sendPresenceUpdate('available', from)
		
		
		// Logs;
		if (!isGroup && isCmd && !fromMe) {	
			console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
		}
		if (isGroup && isCmd && !fromMe) {			
			console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(msg.messageTimestamp *1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
		}

		switch(command) {
		
		case prefix+'otakudesusearch':
		case prefix+'otakudesu':
		if (!q) return ('nama anime nya?')
		var otaku = await fetch(`https://150.230.46.49:4455/anime?type=query&query=${q}`).then(res => res.text())
		reply(otaku + '\n\nresult masi berupa text.json').catch(() => reply(mess.ErrorApi))          
		break

case prefix+'getresulusi':
var Make = await fetch(`https://150.230.46.49:4455/anime?type=getlink&uri=https://otakudesu.watch/episode/teyusha-s2-episode-13-sub-indo/`).then(res => res.json())
        var list = []      
		var teskd = `List Download Per Episode`
		for (let i of Make.data.links) {
		list.push({
		title: i.kualitas, rowId: `${prefix}getbatch `, description: `video`
		})
		}
		var sections = [{title: "Silahkan Pilih Resulusi",rows:list}]
		var yaps = { text: teskd, footer: "nyoba", buttonText: "Click Here", sections }
		conn.sendMessage(from, yaps, {quoted:msg})	
break

/*
request(`https://tinyurl.com/api-create.php?url=${q}`, function (error, response, body) {
try {
reply(body)
} catch (e) {
reply(e)
}
})
*/


        case prefix+'getbatch': {
    var pp = fetch(`https://150.230.46.49:4455/anime?type=getlink&uri=${q}`)
    .then(async (res) => {
    const data = await res.json()

    let pesan = ''
    for (let i = 0; i < data.data.links.length; i++) {
        const mm = data.data.links[i];
        //for lagi
        let pesan_temp = ''
        for (let x = 0; x < mm.provider.length; x++) {
            const jj = mm.provider[x];
            pesan_temp += `${jj.name}: ${jj.link}\n`
        }
        pesan += `\nKualitas ${mm.kualitas}
${pesan_temp}
────────────────────`
    }

    reply(pesan)
})
}
//capeee
/*.then(async (res) => {
    const data = await res.json()

    let pesan = ''
    for (let i = 0; i < data.data.links.length; i++) {
        const mm = data.data.links[i];
        //for lagi
        let pesan_temp = ''
        for (let x = 0; x < mm.provider.length; x++) {
            const jj = mm.provider[x];
            pesan_temp += `${jj.name}: ${jj.link}\n`
        }
        pesan += `\nKualitas ${mm.kualitas}
${pesan_temp}
────────────────────`
    }

    reply(pesan)
})
}*/
        break
       
        /*
    Make fetch(`https://150.230.46.49:4455/anime?type=getlink&uri=https://otakudesu.watch/episode/teyusha-s2-episode-13-sub-indo/).then(res => res.json)    
         
          
           */ 
        
        case prefix+'linkbatch':
        if (!q) return reply('Use /linkbatch url episode\nContoh /linkbatch https://otakudesu.watch/episode/kyuoskni-p2-episode-12-sub-indo/')
        var linkbatch = await fetch(`https://150.230.46.49:4455/anime?type=detail&uri=${args[1]}`).then(res => res.json())                
        var list = []      
		var teskd = `List Download Per Episode`
		for (let i of linkbatch.data.eps) {
		list.push({
		title: i.title, rowId: `${prefix}getbatch ${i.link}`, description: `Download/Streaming`
		})
		}
		var sections = [{title: "Download per episode!",rows:list}]
		const Lm = { text: teskd, footer: "Silahkan pilih Episode yang ingin di tonton/di download", buttonText: "Click Here", sections }
		conn.sendMessage(from, Lm, {quoted:msg})	
					     	        
        break
        
		
		/*case prefix+'home':
		case prefix+'otakudesuhome':
		var pp = await fetch(`https://150.230.46.49:4455/anime?type=home`).then(res => res.json())
		//console.log(pp)
		var home = 'result'
		var listSerch = []
		var teskd = `List Episode Baru Anime`
		for (let i of pp.data) {
		listSerch.push({
		title: i.title, rowId: `${prefix}getdetail ${i.link}`, description: `Hari ${i.hari} ${i.eps}`
		})
		}
		var sections = [{title: "Episode Baru!",rows:listSerch}]
		const listMessage = { text: teskd, footer: "Anime new rilis episode", buttonText: "Click Here", sections }
		conn.sendMessage(from, listMessage, {quoted:msg})			
		break*/

        case prefix+'tesss':
        	  console.log(color(figlet.textSync(`KONTOLLLL`, {
        font: 'Standard',
        horizontalLayout: 'default',
        vertivalLayout: 'default',
        width: 80,
        whitespaceBreak: false
        }), 'aqua')) 
        break



		case prefix+'getdetail':	
		var getDetail = await fetch(`https://150.230.46.49:4455/anime?type=detail&uri=${args[1]}`).then(res => res.json())
		//console.log(batch)
		var detail = `\n${getDetail.data.info}\n`
		/*for (let i of getDetail.data.eps) {
                detail += (`\n────────────────────\n*Tanggal :* ${i.tanggal}\n*Judul :* ${i.title}\n*Source :* \n${i.link}\n`)
                }*/

let buttons = [{buttonId: `${prefix}linkbatch ${args[1]}`, buttonText: { displayText: 'batch' }, type: 1 }]
let buttonMessage = {
document: tamnel, 
fileName: 'Anime Detail', 
mimetype: `text/css`,
fileLength: "82999999990000000000",
pageCount: "160207", 
caption: detail,
mentions:[sender],
footer: `"succes":"200"`, 
buttons: buttons,
headerType: 3,
contextInfo: {
"externalAdReply": { 
"mentionedJid" : sender,
"title" : setting.botName,
"mediaType" : 1,
"renderLargerThumbnail" : true , 
"showAdAttribution": true, 
"jpegThumbnail": tamnel, 
"mediaUrl": 'youtube.com/c/febzabotz', 
"thumbnail": tamnel, 
"thumbnailUrl": getDetail.data.img,
"sourceUrl" : 'youtube.com/c/febzabotz', 
}}
}

conn.sendMessage(from, buttonMessage, { quoted: flokasi }) 
				  
break


			case prefix+'menu':
			case prefix+'help':			
			var teks = `Hallo kak ${pushname}👋saya bob si bot😼\nSaya di program untuk membantu para\nPengguna WhatsApp!!`
			    var but = [{buttonId: `tws`, buttonText: { displayText: 'help' }, type: 1 }]
	            conn.sendMessage(from, { text: `${teks}`, buttons: but, footer: `${jam}` }, { quoted: fake })	
		        await sleep(3000)
			    var teks2 = allmenu(sender, prefix, botName, runtime, pushname, ownerName)
	               //conn.sendMessage(from, {text : teks,  templateButtons: buttonsDefault, footer: '© febriansyah.id'})
	               conn.sendMessage(from, { caption: teks2, image: fs.readFileSync(setting.pathimg), templateButtons: buttonsDefault, footer: 'あPebri･Kaito', mentions: [sender]} )
				break	
				
	       case prefix+'tes':
	            	
break
				
           case prefix+'chara':
                if (!q) return reply('example #chara origami')
                hx.chara(q)
                .then(result => {                
                var res = pickRandom(result)
                	var but = [{buttonId: `${command} ${q}`, buttonText: { displayText: 'Next' }, type: 1 }]
					conn.sendMessage(from, { caption: `result from ${res}`, image: { url: res }, buttons: but, footer: 'click for next photo' }, { quoted: fake })		    
                }).catch(() => reply('not result'))
                break

           case prefix+'ytmp4': case prefix+'mp4':			    
			    if (args.length < 2) return reply(`Kirim perintah ${command} link`)
			    if (!isUrl(args[1])) return reply(mess.ErrorLink)
			    if (!args[1].includes('youtu.be') && !args[1].includes('youtube.com')) return reply(mess.error.Iv)
			    reply(mess.wait)
			    hx.youtube(args[1]).then( result => {
                var teks = `Title : *${result.title}*\nQuality : *${result.quality}*`                			   			    			    			  
			    conn.sendMessage(from, { video: { url: result.link }, mimetype: 'video/mp4' }, { quoted: msg })   
				}).catch(() => reply(mess.ErrorApi))
			    break

           case prefix+'ytmp3': case prefix+'mp3':
    		    if (args.length < 2) return reply(`Kirim perintah ${command} link`)
			    if (!isUrl(args[1])) return reply(mess.Error.link)
			    if (!args[1].includes('youtu.be') && !args[1].includes('youtube.com')) return reply(mess.error.Iv)
			    reply(mess.wait)
			    hx.youtube(args[1]).then(result => {    
			    conn.sendMessage(from, { audio: { url: result.mp3 }, mimetype: 'audio/mp4' }, { quoted: msg })
                }).catch(() => reply(mess.ErrorApi))
			    break
			    
            		
            //#anime search📛
            case prefix+'anime':			                
			    if (!q) return reply('judul?')
			    xfar.Anime(q)
			        .then(data => {console.log(data)
			    let hamsil = `*「  Anime ${q} 」*\n*Author* : ${data[0].author}\n*Penata Ulang* : PebriWeboo🎌\n\n`
			    for (let i of data) {
                hamsil += (`\n────────────────────\n\n *Judul :* ${i.judul}\n *Source :* \n${i.link}\n`)
                }
                reply(hamsil)
			    //conn.sendMessage(from, { image: { url: data[0].thumbnail }, caption: hamsil }, { quoted: msg })			    
			    }).catch(() => reply(`Judul anime tidak ditemukan/ server sedangkan gangguan`))
			    break	

            case prefix+'manga':			     
              if (!q) return reply('tiitle? example : #manga naruto')
            xfar.Manga(q)
			        .then(data => {
		var home = 'result'
		var listSerch = []
		var teskd = `Inget waktu bang!! jan lama-lama bacanya🗿`
		for (let i of data) {
		listSerch.push({
		title: i.judul, rowId: `tau`
		})
		}
		var sections = [{title: `result from ${q}`,rows:listSerch}]
		const listMessage = { text: teskd, footer: "manga search", buttonText: "Click Here", sections }
		conn.sendMessage(from, listMessage, {quoted:msg})			})		          		 
		break
			    
			    			   			    			    
			    
            case prefix+'mangatoons':                
			    if (!q) return reply('title? example : #mangatoons boy school')
			    xfar.Mangatoons(q)
			        .then(data => {console.log(data)
			    var eto = `*「  Mangatoons ${q} 」*\n*Author* : ${data[0].author}\n*Penata Ulang* : PebriWeboo🎌\n\n`
			    for (let i of data) {
                eto += (`\n────────────────────\n\n *Judul :* ${i.judul}\n *Genre :* \n${i.genre}\n\n *Source :* \n${i.link}\n`)
                }                
                conn.sendMessage(from, { image: { url: data[0].thumbnail }, caption: eto }, { quoted: msg })			    
			    }).catch(() => reply(`Judul manga tidak ditemukan`))
			    break

			case prefix+'webtoons':			    
			    if (!q) return reply('tittle? example : #webtoons school')
			    xfar.Webtoons(q)
			        .then(data => {console.log(data)
			    var eta = `*❒「  Webtoons ${q} 」*\n*🌿 Author* : ${data[0].author}\n*✨ Penata Ulang* : PebriWeboo🎌\n\n`
			    for (let i of data) {
                eta += (`\n────────────────────\n\n *📍Judul :* ${i.judul}\n *💌 Suka :* ${i.like}\n *🔔 Genre :* ${i.genre}\n *👑 Creator :* ${i.creator}\n *🌍 Source :* ${i.url}`)
                }
                reply(eta)
                //conn.sendMessage(from, { image: { url: data[0].thumbnail }, caption: eta }, { quoted: msg })			   			    
			    }).catch(() => reply(`Judul manga tidak ditemukan`))
			    break			    

            //#islamic☪️
            case prefix+'surah':			                
			    if (!q) return reply('surah nya kak! example : #surah Al-alaq')
			    xfar.Surah(q)
 			        .then(data => {console.log(data)
			    var hsl = `*❒「  Surah ${q} 」*\n*Author* : ${data[0].author}\n*Penata Ulang* : PebriWeboo🎌\n\n`
			    for (let i of data) {
                hsl += (`*❒ Arab :* ${i.arab}\n *❒ Latin :* \n${i.latin}\n*❒ Latin :* \n${i.translate}\n\n`)
                }
			    reply(hsl)			    
			    });
			    break
			
			case prefix+'listsurah':
			    reply (listsurah.all)
			    break
	 
      	
			// Main Menu

				break
			case prefix+'runtime':
			    reply(runtime(process.uptime()))
			    break

		            break
			case prefix+'donate':
			case prefix+'donasi':
			    reply(`──「 MENU DONATE 」──\n\nHi ${pushname} 👋🏻\n\`\`\`GOPAY/DANA/PULSA : 085849261085\`\`\`\n\nTerimakasih untuk kamu yang sudah donasi untuk perkembangan bot ini _^\n──「 THX FOR YOU ! 」──`)
			    break
			case prefix+'owner':
			    for (let x of ownerNumber) {
			      sendContact(from, x.split('@s.whatsapp.net')[0], 'Owner', msg)
			    }
			    break

	        // Converter & Tools Menu
			case prefix+'sticker': case prefix+'stiker': case prefix+'s':
			    
				if (isImage || isQuotedImage) {
		           var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
			       var buffer = Buffer.from([])
			       for await(const chunk of stream) {
			          buffer = Buffer.concat([buffer, chunk])
			       }
			       var rand1 = 'lib/'+getRandom('.jpg')
			       var rand2 = 'lib/'+getRandom('.webp')
			       fs.writeFileSync(`./${rand1}`, buffer)
			       ffmpeg(`./${rand1}`)
				.on("error", console.error)
				.on("end", () => {
				  exec(`webpmux -set exif ./lib/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
				    conn.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
				    
					fs.unlinkSync(`./${rand1}`)
			            fs.unlinkSync(`./${rand2}`)
			          })
				 })
				.addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
				.toFormat('webp')
				.save(`${rand2}`)
			    } else if (isVideo || isQuotedVideo) {
				 var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
				 var buffer = Buffer.from([])
				 for await(const chunk of stream) {
				   buffer = Buffer.concat([buffer, chunk])
				 }
			     var rand1 = 'lib/'+getRandom('.mp4')
				 var rand2 = 'lib/'+getRandom('.webp')
			         fs.writeFileSync(`./${rand1}`, buffer)
			         ffmpeg(`./${rand1}`)
				  .on("error", console.error)
				  .on("end", () => {
				    exec(`webpmux -set exif ./lib/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
				      conn.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
				      
					  fs.unlinkSync(`./${rand1}`)
				      fs.unlinkSync(`./${rand2}`)
				    })
				  })
				 .addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
				 .toFormat('webp')
				 .save(`${rand2}`)
                } else {
			       reply(`Kirim gambar/vidio dengan caption ${command} atau balas gambar/vidio yang sudah dikirim\nNote : Maximal vidio 10 detik!`)
			    }
                break
	        // Downloader Menu
			case prefix+'tiktok':
			    
			    if (args.length < 2) return reply(`Kirim perintah ${command} link`)
			    if (!isUrl(args[1])) return reply(mess.ErrorLink)
			    if (!args[1].includes('tiktok')) return reply(mess.ErrorLink)
			    reply(mess.wait)
			    hx.ttdownloader(args[1]).then( data => {
			      conn.sendMessage(from, { video: { url: data.nowm }, mimetype: 'video/mp4' }, { quoted: msg })
				  
			    }).catch(() => reply(mess.ErrorApi))
			    break

			    			    
			case prefix+'tiktokaudio':
			    
			    if (args.length < 2) return reply(`Kirim perintah ${command} link`)
			    if (!isUrl(args[1])) return reply(mess.ErrorLink)
			    if (!args[1].includes('tiktok')) return reply(mess.ErrorLink)
			    reply(mess.wait)
			    hx.ttdownloader(args[1]).then( data => {
			      conn.sendMessage(from, { audio: { url: data.audio }, mimetype: 'audio/mp4' }, { quoted: msg })
			       
				}).catch(() => reply(mess.ErrorApi))
		        break

		        
                

			    
			    
			// Owner Menu
			case prefix+'exif':
			    if (!isOwner) return reply(mess.OnlyOwner)
			    var namaPack = q.split('|')[0] ? q.split('|')[0] : q
                var authorPack = q.split('|')[1] ? q.split('|')[1] : ''
                exif.create(namaPack, authorPack)
				reply(`Sukses membuat exif`)
				break
			case prefix+'leave':
			    if (!isOwner) return reply(mess.OnlyOwner)
				if (!isGroup) return reply(mess.OnlyGrup)
				conn.groupLeave(from)
			    break
			case prefix+'join':
			    if (!isOwner) return reply(mess.OnlyOwner)
				if (args.length < 2) return reply(`Kirim perintah ${command} _linkgrup_`)
				if (!isUrl(args[1])) return reply(mess.ErrorLink)
				var url = args[1]
			    url = url.split('https://chat.whatsapp.com/')[1]
				var data = await conn.groupAcceptInvite(url)
				reply(jsonformat(data))
				break
			case prefix+'setpp': case prefix+'setppbot':
		        if (!isOwner) return reply(mess.OnlyOwner)
		        if (isImage || isQuotedImage) {
				  var media = await downloadAndSaveMediaMessage('image', 'ppbot.jpeg')
				  var data =  await conn.updateProfilePicture(botNumber, { url: media })
			      fs.unlinkSync(media)
				  reply(`Sukses`)
				} else {
				  reply(`Kirim/balas gambar dengan caption ${command} untuk mengubah foto profil bot`)
				}
				break


			case prefix+'pinterest':
			case prefix+'pin':
			    
				if (args.length < 2) return reply(`Kirim perintah ${command} query atau ${command} query --jumlah\nContoh :\n${command} cecan atau ${command} cecan --10`)
			//	reply(mess.wait)
			    var jumlah;
			    if (q.includes('--')) jumlah = q.split('--')[1]
			    pinterest(q.replace('--'+jumlah, '')).then(async(data) => {
				  if (q.includes('--')) {
					if (data.result.length < jumlah) {
					  jumlah = data.result.length
					  reply(`Hanya ditemukan ${data.result.length}, foto segera dikirim`)
					}
					for (let i = 0; i < jumlah; i++) {
					  conn.sendMessage(from, { image: { url: data.result[i] }})
					}
				    
				  } else {
					var but = [{buttonId: `${command} ${q}`, buttonText: { displayText: 'Next Photo' }, type: 1 }]
					conn.sendMessage(from, { caption: `Hasil pencarian dari ${q}`, image: { url: pickRandom(data.result) }, buttons: but, footer: 'Pencet tombol dibawah untuk foto selanjutnya' }, { quoted: msg })
				    
				  }
				})
			    break
			case prefix+'yts': case prefix+'ytsearch': case prefix+'youtubesearch':
			    
			    if (args.length < 2) return reply(`Kirim perintah ${command} query`)
				reply(mess.wait)
			    yts(q).then( data => {
				  let yt = data.videos
				  var jumlah = 15
				  if (yt.length < jumlah) jumlah = yt.length
				  var no = 0
				  let txt = `*YOUTUBE SEARCH*

 *Data berhasil didapatkan*
 *Hasil pencarian dari ${q}*`
                for (let i = 0; i < jumlah; i++) {
				  no += 1
				  txt += `\n─────────────────\n\n*No Urutan : ${no.toString()}*\n*▢ Judul :* ${yt[i].title}\n*▢ ID :* ${yt[i].videoId}\n*▢ Channel :* ${yt[i].author.name}\n*▢ Upload :* ${yt[i].ago}\n*▢ Ditonton :* ${yt[i].views}\n*▢ Duration :* ${yt[i].timestamp}\n*▢ URL :* ${yt[i].url}\n`
				}
				conn.sendMessage(from, { image: { url: yt[0].image }, caption: txt }, { quoted: msg })
				
				}).catch(() => reply(mess.ErrorApi))
			    break

			// Group Menu
			case prefix+'linkgrup': case prefix+'link': case prefix+'linkgc':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				var url = await conn.groupInviteCode(from).catch(() => reply(mess.ErrorApi))
			    url = 'https://chat.whatsapp.com/'+url
				reply(url)
				break
			case prefix+'setppgrup': case prefix+'setppgc':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (isImage || isQuotedImage) {
				  var media = await downloadAndSaveMediaMessage('image', `ppgc.jpeg`)
			      await conn.updateProfilePicture(from, fs.readFileSync(`./${media}`))
				  .then( res => {
					reply(`Sukses`)
					fs.unlinkSync(media)
				  }).catch(() => reply('Error'))
				} else {
			      reply(`Kirim/balas gambar dengan caption ${command}`)
				}
				break
			case prefix+'setnamegrup': case prefix+'setnamegc':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} teks`)
				await conn.groupUpdateSubject(from, q)
			    .then( res => {
				  reply(`Sukses`)
				}).catch(() => reply(mess.ErrorApi))
			    break
			case prefix+'setdesc': case prefix+'setdescription':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} teks`)
				await conn.groupUpdateDescription(from, q)
			    .then( res => {
			      reply(`Sukses`)
				}).catch(() => reply(mess.ErrorApi))
				break
			case prefix+'group': case prefix+'grup':
		        if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} _options_\nOptions : close & open\nContoh : ${command} close`)
				if (args[1] == "close") {
				  conn.groupSettingUpdate(from, 'announcement')
				  reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
				} else if (args[1] == "open") {
				  conn.groupSettingUpdate(from, 'not_announcement')
				  reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
				} else {
				  reply(`Kirim perintah ${command} _options_\nOptions : close & open\nContoh : ${command} close`)
				}
			    break
			case prefix+'revoke':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins) return reply(mess.GrupAdmin)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				await conn.groupRevokeInvite(from)
			    .then( res => {
				  reply(`Sukses menyetel tautan undangan grup ini`)
				}).catch(() => reply(mess.ErrorApi))
				break
			case prefix+'hidetag':
		        if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
			    let mem = [];
		        groupMembers.map( i => mem.push(i.id) )
				conn.sendMessage(from, { text: q ? q : '', mentions: mem })
			    break
			// Bank & Payment Menu

			case prefix+'speed': case prefix+'pingbot':{
                const used = process.memoryUsage()
                const cpus = os.cpus().map(cpu => {
                    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
			        return cpu
                })
                const cpu = cpus.reduce((last, cpu, _, { length }) => {
                    last.total += cpu.total
                    last.speed += cpu.speed / length
                    last.times.user += cpu.times.user
                    last.times.nice += cpu.times.nice
                    last.times.sys += cpu.times.sys
                    last.times.idle += cpu.times.idle
                    last.times.irq += cpu.times.irq
                    return last
                }, {
                    speed: 0,
                    total: 0,
                    times: {
			            user: 0,
			            nice: 0,
			            sys: 0,
			            idle: 0,
			            irq: 0
                }
                })
                let timestamp = speed()
                let latensi = speed() - timestamp
                var neww = performance.now()
                var oldd = performance.now()
                var respon = `
Kecepatan Respon ${latensi.toFixed(4)} _Second_ \n ${oldd - neww} _miliseconds_\n\nRuntime : ${runtime(process.uptime())}

💻 Info Server
RAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}

_NodeJS Memory Usaage_
${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')}: ${formatp(used[key])}`).join('\n')}

${cpus[0] ? `_Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
_CPU Core(s) Usage (${cpus.length} Core CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}
                `.trim()
                reply(respon)
            }
            break
            
								
			default:
			
					if (chats.startsWith("> ") && isOwner) {
		console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
		  const ev = (sul) => {
            var sat = JSON.stringify(sul, null, 2)
            var bang = util.format(sat)
            if (sat == undefined) {
              bang = util.format(sul)
            }
            return textImg(bang)
          }
          try {
           textImg(util.format(eval(`;(async () => { ${chats.slice(2)} })()`)))
          } catch (e) {
           textImg(util.format(e))
          }
		} else if (chats.startsWith("$ ") && isOwner) {
        console.log(color('[EXEC]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
          exec(chats.slice(2), (err, stdout) => {
		    if (err) return reply(`${err}`)
		    if (stdout) reply(`${stdout}`)
		  })
        } else if (chats.startsWith("x ") && isOwner) {
	    console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkaokwoak`))
		 try {
	       let evaled = await eval(chats.slice(2))
		   if (typeof evaled !== 'string') evaled = require("util").inspect(evaled)
			reply(`${evaled}`)
		 } catch (err) {
		   reply(`${err}`)
		 }
		}
			
		}
	} catch (err) {
		console.log(color('[ERROR]', 'red'), err)
	}
}
