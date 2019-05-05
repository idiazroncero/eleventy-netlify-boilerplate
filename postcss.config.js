const postcssPresetEnv = require('postcss-preset-env');
const stylelint = require('stylelint');


module.exports = {
  plugins: [
    postcssPresetEnv(),
    stylelint()
  ]
}