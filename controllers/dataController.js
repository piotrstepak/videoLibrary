var fs = require('fs');
var createCsvWriter = require('csv-write-stream');
const { get } = require('http');
var csvWriter = createCsvWriter();
const filePath = 'data.csv';
// global.URL = require('url').URL;
// var URL = require('url').URL;

function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const youtubeIdLength = 11;
    return (match && match[2].length === youtubeIdLength)
      ? match[2]
      : null;
}

function convertUrlToEmbed(url) {
    const videoId = getId(url);
    return `https://www.youtube.com/embed/${videoId}`;
}

function convertToTags(string) {
    let words = string.split(/\s+/);
    console.log(`received tags: ${string}`)
    // console.log(words + " |words");
    const hashSymbol = '#';
    let tagsString = "";

    for (word of words) {
        (word[0] === hashSymbol) ? 
        tagsString.concat(`${word.toLowerCase()} `) : 
        tagsString.concat(hashSymbol.concat(`${word.toLowerCase()} `));
    }
    // console.log(tagsString+" |str")
    return tagsString;    
}

function isEmailValid(email) {
    const emailReg = /^[0-9a-z_.-]+@[0-9a-z.-]+\.[a-z]{2,3}$/i;
    return (emailReg.test(email)) ? true : false;
}

function isUrlValid(url) {
    const urlReg = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    return (urlReg.test(url)) ? true : false;
}

function isTagsValid(tags) {
    let tags = string.split(/\s+/);
    const hashSymbol = '#';
    for (tag of tags) {
        if (tag[0] !== hashSymbol) {
            return false;
        }
    }
    return true;
}

function validateDataFromForm(data) {//ewentualnie trimy otrzymanych danych
    if (data['url'].length > 0 && !isUrlValid(data['url'])) {
        return alert('Incorrect url syntax');
    }
    if (data['title'].trim() === '' ||  data['title'].length < 3) {
        return alert('Titile: minimum length - 3 characters');
    }
    if (data['description'].trim() === '') {
        return alert('Description is required')
    }
    if (data['tags'].length > 0 && !isTagsValid(data['tags'])) {
        return alert('Incorrect tags: tags should starting with # and separated by whitelines');
    }
    if (data['uploaded'] !== '' && data['uploaded'].length < 3) {
        return alert('Uploaded by: minimum length - 3 characters');
    }
    if (data['email'] !== '' && !isEmailValid(data['email'])) {
        return alert('Incorrect email address');
    }
    //ewentualnie ify wyniesc do czytelniejszych metod
}

// TODO uzyc metody validateDataFromForm do validacji po stronie servera
exports.saveDataToCsv = (req, res) => {
    const dataFromCsv = fs.readFileSync(filePath).toString()
                                          .split('\n')
                                          .map(e => e.trim())
                                          .map(e => e.split(';'));
    const data = {
        url: req.body.url, 
        title: req.body.title, 
        description: req.body.description, 
        tags: req.body.tags, 
        uploaded: req.body.uploaded,
        email: req.body.email,
        archive: ['false'],
        index: [dataFromCsv.length - 1] //pomyslec na latwiejszym dostepem do indexow z csv np od razu na stronie wyswietlac indexy z bazy
    };
    data['url'] = convertUrlToEmbed(req.body.url);
    data['tags'] = convertToTags(req.body.tags);
    console.log(data);
    const headers = ['Url', 'Title', 'Description', 'Tags', 'Uploaded by', 'Contact email', 'Archive', 'Index'];//?
  
    (!fs.existsSync(filePath)) ? csvWriter = createCsvWriter({headers: headers}) 
                               : csvWriter = createCsvWriter({sendHeaders: false, separator: ';'});//zastanowic sie
    // console.log(data);
    
    csvWriter.pipe(fs.createWriteStream(filePath, {flags: 'a'}));
    csvWriter.write(data);
    csvWriter.end();
    //uzyc promisea
    res.redirect('/');
};

exports.updateDataInCsv = (req, res) => {
    //TODO Error: no headers specified ?
    const dataFromCsv = fs.readFileSync(filePath).toString()
                                          .split('\n')
                                          .map(e => e.trim())
                                          .map(e => e.split(';'));
    console.log(dataFromCsv);
    console.log(`Received index: ${req.params['id']}`);
    // req.body.index
    const rowIndex = req.params['id'];                                      
    dataFromCsv[rowNumber] = [
        req.body.url, 
        req.body.title, 
        req.body.description, 
        req.body.tags, 
        req.body.uploaded, 
        req.body.email, 
        req.body.archive,
        rowIndex
    ];
    console.log(dataFromCsv);

     // const headers = ['Url', 'Title', 'Description', 'Tags', 'Uploaded by', 'Contact email', 'Archive', 'Index'];
     const headers = ['url', 'title', 'description', 'tags', 'uploaded', 'email', 'archive', 'index'];
    // const headers = ['title', 'story', 'criteria', 'value', 'estimation', 'status'];
    // (!fs.existsSync(filePath)) ? csvWriter = createCsvWriter({headers: headers}) 
    //                            : csvWriter = createCsvWriter({sendHeaders: false, separator: ';'});//zastanowic sie
    
    csvWriter = createCsvWriter({sendHeaders: false, separator: ';'});//true ???
    csvWriter.pipe(fs.createWriteStream(filePath, {flags: 'w', headers: headers}));
    csvWriter.write(dataFromCsv);
    csvWriter.end();
    //uzyc promisea
    res.redirect('/');
}