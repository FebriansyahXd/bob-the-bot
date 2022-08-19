const fs = require('fs')
const chalk = require('chalk')

const groupResponse = async (conn, update) => {
/**
@ { Masih polos, jadi tolong bagusin }
**/
const metadata = await conn.groupMetadata(update.id)   
   for (let participant of update.participants) {
    let fkontak = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(update.jid ? { remoteJid: '6283136505591-1604595598@g.us' } : {})}, message: { "contactMessage":{"displayName": `${metadata.subject}`,"vcard":`BEGIN:VCARD\nVERSION:3.0\nN:2;rifza;;;\nFN:rifza\nitem1.TEL;waid=6287708357324:6287708357324\nitem1.X-ABLabel:Mobile\nEND:VCARD` }}}
    try{
     if (update.action == 'add') {
      await conn.sendMessage(update.id, 
      { text: `Hay @${participant.split("@")[0]} welcome`, "contextInfo": { mentionedJid: [participant] }}, {quoted : fkontak}     
      )
      } else 
      if (update.action == 'remove') {
      await conn.sendMessage(update.id, 
      { text: `GODBYE.... @${participant.split("@")[0]}`, "contextInfo": { mentionedJid: [participant] } }, {quoted : fkontak}     
      )
     }
     } catch (e){ e = String(e) 
     console.log(e) 
    } 
   }
}
module.exports = { groupResponse }  

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.limeBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})


