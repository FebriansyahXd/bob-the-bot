const fs = require("fs");

exports.allmenu = (sender, prefix, botName, runtime, pushname, ownerName) => {
	return `┌━━━━━━━━━━━━┈ ❋ཻུ۪۪⸙
│ *⦿ Bot Prefix : ${prefix}*
│ *⦿ Owner : ${ownerName}*
└┬────────────┈ ⳹
┌┤ 「  *Status bot*  」
││➥ *Nama Bot :* ${botName}
││➥ *Version :* 1.0.0
││➥ *UpTime :* ${runtime(process.uptime())}
│└────────────┈ ⳹
│ 「 *Searching* 」
│◦➛ ${prefix}pinterest
│◦➛ ${prefix}youtubesearch
├─────────────┈ ⳹
│ 「 *Anime* 」
│◦➛ ${prefix}chara
│◦➛ ${prefix}anime
│◦➛ ${prefix}manga
│◦➛ ${prefix}webtoons
│◦➛ ${prefix}mangatoons
├─────────────┈ ⳹
│ 「 *Downloader* 」
│◦➛ ${prefix}titkok
│◦➛ ${prefix}ytmp3
│◦➛ ${prefix}ytmp4
└┬────────────┈ ⳹
┌┤  *© febriansyah.id*
│└────────────┈ ⳹
│ *Thank To Devoloper*
└━━━━━━━━━━━━┈ ❋ཻུ۪۪⸙
`
}

/*



*/

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log('update!!')
	delete require.cache[file]
	require(file)
})