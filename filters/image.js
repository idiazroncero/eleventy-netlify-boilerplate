const { lfs, nf_resize, relativeSourceDir } = require('../images.config'); 


function imageLFS(sourceFile, query){
  if(query) {
    var actualQuery = `?nf_resize=${nf_resize}&${query}`;
  }
  return `<img src="${ relativeSourceDir + '/' + sourceFile }${ actualQuery }" />`
}


function image(sourceFile){
  var sourcePointSplit = sourceFile.split('.')
  var webp =  sourcePointSplit[0] + '.webp';
  return `<picture>
            <source type="image/webp" srcset="${ relativeSourceDir + '/' + webp }" />
            <source srcset="${ relativeSourceDir + '/' + sourceFile }" />
            <img src="${ relativeSourceDir + '/' + sourceFile }" />
          </picture>`
}


module.exports = lfs ? imageLFS : image;