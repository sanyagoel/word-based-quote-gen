const path = require('path');
const rootDir = require('../utils/path');
const getHome = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'public', 'index.html'));
}

const getAuthor=(req,res,next)=>{
    res.render('author.ejs');
}


module.exports = {
    geth : getHome,
    getath : getAuthor
}

