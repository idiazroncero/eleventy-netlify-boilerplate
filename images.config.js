const config =  {
    // Set to true to use LFS
    lfs : true,
    // If lfs = true;
    nf_resize: 'smartcrop',
    sourceDir : './src/public/images',
    relativeSourceDir : '/public/images',
    sizes : [
        {
            name: 'large',
            width: 1400,
            height: false,
            isResponsive: true
        },
        {
            name: 'medium',
            width: 800,
            height: false,
            isResponsive: true
        },
        {
            name: 'small',
            width: 480,
            height: false,
            isResponsive: true
        },
        {
            name: 'thumb',
            width: 150,
            height: 150,
            isResponsive: false
        },
        {
            name: 'icon',
            width: 50,
            height: 25,
            isResponsive: false
        },
    ],
}

config.sizeNames = config.sizes.map(function(item){
    return item.name;
})

module.exports = config;