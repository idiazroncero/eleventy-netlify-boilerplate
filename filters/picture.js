const { relativeSourceDir, sizes, lfs, nf_resize } = require('../images.config'); 
const filePaths = require('./filePaths');

function pictureLFS (sourceFile){
    var paths = sizes.map(item => {
        const isResponsive = item.isResponsive;
        if(isResponsive) {
            var height = item.height ? `&h=${item.height}` : '';
            var height2x = item.height ? `&h=${item.height * 2}` : '';
            return {
                    path : `${relativeSourceDir}/${sourceFile}?nf_resize=${nf_resize}&w=${item.width}${height}`,
                    path2x : `${relativeSourceDir}/${sourceFile}?nf_resize=${nf_resize}&w=${item.width * 2 }${height2x}`,
                    width : item.width
                }
        } else {
            return false;
        }
    }).filter(item => {
        return item != false;
    });
  
    var srcset = paths.map(item => {
        return item.path + ' ' + item.width + 'w';
    });

    var srcset2x = paths.map(item => {
        return item.path2x + ' ' + (item.width * 2) + 'w';
    });

    var srcsetString = [...srcset, ...srcset2x].join(',');

    return `<picture>
                <source srcset="${srcsetString}"
                    sizes = "100vw"/>
                <img src="${ relativeSourceDir + '/' + sourceFile }" />
            </picture>`
}

function picture (sourceFile){

    var paths = sizes.map(item => {
      const hasItem = filePaths(sourceFile, item);
      const isResponsive = item.isResponsive;
      if(hasItem && isResponsive) {
        return hasItem;
      } else {
          return false;
      }
    }).filter(item => {
        return item != false;
    });

    var srcset = paths.map(item => {
        return item.path + ' ' + item.width + 'w';
    });

    var srcset2x = paths.map(item => {
        return item.path2x + ' ' + item.width2x + 'w';
    });

    var srcsetWebp = paths.map(item => {
        return item.pathWebp + ' ' + item.width + 'w';
    });

    var srcset2xWebp = paths.map(item => {
        return item.path2xWebp + ' ' + item.width + 'w';
    });

    var srcsetString = [...srcset, ...srcset2x].join(',');
    var srcsetWebpString = [...srcsetWebp, ...srcset2xWebp].join(',');

    return `<picture>
              <source type="image/webp"
                srcset="${srcsetWebpString}"
                sizes = "100vw"/>
              <source 
              srcset="${srcsetString}"
                sizes = "100vw"/>
              <img src="${ relativeSourceDir + '/' + sourceFile }" />
            </picture>`
}

module.exports = lfs ? pictureLFS : picture;