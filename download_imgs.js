const fs = require('fs')
const path = require('path')
const request = require('request')

const download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
  })
};

const download_all = (txt_file) => {
  let source_file = path.join('txt_results', txt_file)
  const lines = fs.readFileSync(source_file, 'utf8')
  let img_uri_list = lines.split('\n')
  let count = 0
  for (let uri of img_uri_list) {
    let arr = uri.split('/')
    let img_name = count.toString()
    let folder_name = txt_file.split('.')[0]
    let folder_path = path.join('downloads', folder_name)
    if (!fs.existsSync(folder_path)){
        fs.mkdirSync(folder_path);
    }
    let filename = `${folder_path}/${img_name}.jpg`
    try {
      download(uri, filename, () => {})
      count += 1
    } catch (err) {
      continue
    }
  }
}

const DOWNLOAD_FOLDER = 'downloads'
if (!fs.existsSync(DOWNLOAD_FOLDER)){
  fs.mkdirSync(DOWNLOAD_FOLDER);
}

const TXT_FOLDER = 'txt_results'
fs.readdirSync(TXT_FOLDER).forEach(file => {
  download_all(file)
})

