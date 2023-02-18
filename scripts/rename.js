const fs = require('fs');
fs.readdirSync(__dirname + '/../dist/').forEach(elmt => {
    const newName = elmt.replaceAll(' ', '-');
    console.log(`${elmt} => ${newName}`);
    fs.renameSync(__dirname + '/../dist/' + elmt, __dirname + '/../dist/' + newName);
});