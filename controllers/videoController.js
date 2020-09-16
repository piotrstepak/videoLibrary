const fs = require('fs');
const filePath = 'data.csv';

exports.add = (req, res) => {
    res.render('addVideo');
};

exports.update = (req, res) => {
    // const receivedId = req.params['id'];
    const data = fs.readFileSync(filePath).toString()
                                          .split('\n')
                                          .map(e => e.trim())
                                          .map(e => e.split(';'));
    console.log(`Received data: ${req.params['id']}`)
    res.render('updateVideo', {data: data[req.params['id']]});
};