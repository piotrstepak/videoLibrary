const fs = require('fs');
const filePath = 'data.csv';

function checkIs_ElementIsntArchived_And_SubstringIsFound(data, i, req) {
    const titleId = 1;
    const descriptionId = 2;
    return (!(data[i][data.length - 1] === 'true')) && 
            (data[i][titleId].toLowerCase().includes(req.toLowerCase()) || 
            data[i][descriptionId].toLowerCase().includes(req.toLowerCase()));
}

function checkIs_ElementIsntArchived(data, i) {
    return !(data[i][data.length - 1] === 'true');
}

function checkIs_ElementIncludeTag(data, i, receivedTag) {
    const tagsId = 3;
    let tags = data[i][tagsId].split('#');
    tags.shift();
    for (element of tags) {
        typeof receivedTag
        if (element.trim() == receivedTag) {
            
            return true;
        }
    }
    return false;
}

// TODO zrobic jedna uniwersalna funkcje z dla ponizszych 3, w param metoda i req
exports.homeRandom = (req, res) => {
    let data = fs.readFileSync(filePath).toString()
                                          .split('\n')
                                          .map(e => e.trim())
                                          .map(e => e.split(';'));
    const headers = data[0];
    data.shift();//remove headers
    data.pop(); //remove blank line
    let dataToDisplay = [];

    for (let i = 0; i < data.length; i++) {
        if (checkIs_ElementIsntArchived(data, i)) {
            dataToDisplay.push(data[i]);
        }
    };
    dataToDisplay = dataToDisplay.sort(() => Math.random() - 0.5); //sort random videos
    dataToDisplay.unshift(headers);
    const rowsToDisplay = 6;
    dataToDisplay.length = rowsToDisplay;
    // console.log(data)
    res.render('home', {data: dataToDisplay});
};

exports.search = (req, res) => {
    let data = fs.readFileSync(filePath).toString()
                                          .split('\n')
                                          .map(e => e.trim())
                                          .map(e => e.split(';'));
    const headers = data[0];
    data.shift();
    data.pop();
    console.log(`search: ${req.body.search}`);//pomocniczy print
    let dataToDisplay = [];
    const request = req.body.search;

    for (let i = 0; i < data.length; i++) {
        if (checkIs_ElementIsntArchived_And_SubstringIsFound(data, i, request)) {
            dataToDisplay.push(data[i]);
        }
    };
    dataToDisplay.unshift(headers);
    console.log(dataToDisplay)
    res.render('home', {data: dataToDisplay});
};

exports.tags = (req, res) => {
    let data = fs.readFileSync(filePath).toString()
                                          .split('\n')
                                          .map(e => e.trim())
                                          .map(e => e.split(';'));
    const headers = data[0];
    data.shift();
    data.pop();
    console.log(`Tag: ${req.params['id']}`);//pomocniczy print
    let dataToDisplay = [];
    const request = req.params['id'];

    for (let i = 0; i < data.length; i++) {
        if (checkIs_ElementIncludeTag(data, i, request)) {
            dataToDisplay.push(data[i]);
        }
    };
    dataToDisplay.unshift(headers);
    console.log(dataToDisplay)
    res.render('home', {data: dataToDisplay});
};