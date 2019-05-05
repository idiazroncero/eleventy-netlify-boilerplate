const { relativeSourceDir } = require('../images.config'); 

module.exports = function(sourceFile){
  var sourcePointSplit = sourceFile.split('.')
  var webp =  sourcePointSplit[0] + '.webp';
  return `<picture>
            <source type="image/webp" srcset="${ relativeSourceDir + '/' + webp }" />
            <source srcset="${ relativeSourceDir + '/' + sourceFile }" />
            <img src="${ relativeSourceDir + '/' + sourceFile }" />
          </picture>`
}