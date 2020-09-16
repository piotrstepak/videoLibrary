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
    const hashSymbol = hashSymbol;
    let tagsString = "";

    for (word of words) {
        (word[0] === hashSymbol) ? 
        tagsString.concat(`${word.toLowerCase()} `) : 
        tagsString.concat(hashSymbol.concat(`${word.toLowerCase()} `));
    }
    // console.log(tagsString+" |str")
    return tagsString;    
}

// TODO validacja danych po stronie servera
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
    const headers = ['Url', 'Title', 'Description', 'Tags', 'Uploaded by', 'Contact email', 'Archive', 'Index'];
  
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
    //TODO Error: no headers specified, nie zapisuej(zapisuje ale tylko nowy updateowany wiersz)
    const dataFromCsv = fs.readFileSync(filePath).toString()
                                          .split('\n')
                                          .map(e => e.trim())
                                          .map(e => e.split(';'));
    console.log(dataFromCsv);
    // TODO pobranie konkretnego id z csv
    const rowNumber = 1;                                      
    dataFromCsv[rowNumber] = [
        req.body.url, 
        req.body.title, 
        req.body.description, 
        req.body.tags, 
        req.body.uploaded, 
        req.body.email, 
        req.body.archive
    ];
    // dataFromCsv.shift;
    console.log(dataFromCsv);

    const headers = ['Url', 'Title', 'Description', 'Tags', 'Uploaded by', 'Contact email', 'Archive'];
    // const headers = ['title', 'story', 'criteria', 'value', 'estimation', 'status'];
    (!fs.existsSync(filePath)) ? csvWriter = createCsvWriter({headers: headers}) 
                               : csvWriter = createCsvWriter({sendHeaders: false, separator: ';'});//zastanowic sie

    csvWriter.pipe(fs.createWriteStream(filePath, {flags: 'w', headers: headers}));//headersy tu ? nie dziala powyzszy ternary?
    csvWriter.write(dataFromCsv);
    csvWriter.end();
    //uzyc promisea
    res.redirect('/');
}