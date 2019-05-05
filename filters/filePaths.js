const fs = require('fs');
const { sourceDir, relativeSourceDir } = require('../images.config'); 


module.exports = function(file, size){
    var sourceExt = file.split('.')[1];
    const sourceName = file.split('.')[0];
  
    const path = sourceDir + '/' + size.name + '/' + sourceName + '.' + sourceExt;
  
    if (fs.existsSync(path)) {
      // Check for the 2x images
      var data = {}
      data.has2x = false;
      data.width = size.width;
      data.path = relativeSourceDir + '/' + size.name + '/' + sourceName + '.' + sourceExt;
      data.pathWebp = relativeSourceDir + '/' + size.name + '/' + sourceName + '.webp';
  
      const path2x = sourceDir + '/' + size.name + '/' + sourceName + '@2x.' + sourceExt;
      if (fs.existsSync(path2x)) {
        data.has2x = true;
        data.width2x = size.width * 2;
        data.path2x = relativeSourceDir + '/' + size.name + '/' + sourceName + '@2x.' + sourceExt;
        data.path2xWebp = relativeSourceDir + '/' + size.name + '/' + sourceName + '@2x.webp';
      }
      // Return an object containing the original file, the webp, a flag indicating 2x images and 2x images
      return data;
    } else {
      return false;
    }
  };