const axios = require('axios')
const cheerio = require('cheerio')
const url = require('url')
//IG : https://instagram.com/rifza.p.p
async function zippy(Url) {//comot dari tyz-api 😅
	return new Promise(async(resolve, reject) => { 
		try {
			axios.get(Url).then(res => {
				let result = []
				const $ = cheerio.load(res.data)
				let text = $('#lrbox').find('div.center > div:nth-child(1)').text().split('\n')
				result.title = (text[3] ||'').trim()
				result.size = ((text[4] || '').replace('Size:', '') || '').trim()
				result.upload_date = ((text[5] || '').replace('Uploaded:', '') || '').trim()
				$('script').each((i, e) => {
					let sc = $(e).html().search(/dlbutton/g)
					if (sc >= 0) {
						let divider = $(e).html().split(';')[0]
						let decrypt = divider.split("document.getElementById('dlbutton').href =")[1]					
						let _url
						if (decrypt) {
							_url = url.parse(Url).hostname + eval(decrypt)
							_url = _url.startsWith('http') ? _url : 'http://' + _url
							const url_final = _url
							result.url = url_final
						}
					}
				})
				resolve(result)
			})
  	      } catch(e) {
		console.log(e)
		}
	})}

async function desuDrive(Url) {
	return new Promise(async(resolve, reject) => { 
	try{
     axios.get(Url)
     .then(async res => {
       var load = cheerio.load(res.data)
       const hasil = []
          load(".video-share").each(function(a, z) { 
      	   const link = load(z).find('input').attr('value')		  		  			 	 	
          let iwak = { Link: 'https:' + link }          
          hasil.push(iwak)   
          })     
         let anu = await zippy(hasil[0].Link)
         resolve(anu)
     } )
	} catch(e) {
  console.log(e)
}})}
   
 module.exports = { desuDrive }
 