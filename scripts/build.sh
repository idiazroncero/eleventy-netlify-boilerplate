echo "$(tput setaf 5)------------------------------------------------------------------------"
echo "1 - Compile sass to css, compressed and without sourcemaps, using CLI"
echo "------------------------------------------------------------------------$(tput sgr0)"
yarn css:prod

echo "$(tput setaf 5)------------------------------------------------------------------------"
echo "2 - Apply postcss as configured on postcss.config.js, using CLI"
echo "------------------------------------------------------------------------$(tput sgr0)"
yarn css:post

echo "$(tput setaf 5)------------------------------------------------------------------------------------------------"
echo "3 - Javascript: use Parcel.js to bundle and transpile the JS file"
echo "$(tput setaf 5)------------------------------------------------------------------------------------------------$(tput sgr0)"
yarn js:build

echo "$(tput setaf 5)------------------------------------------------------------------------"
echo "4 - Generate the static assets on /dist folder, using Eleventy"
echo "------------------------------------------------------------------------$(tput sgr0)"
yarn eleventy

echo "$(tput setaf 2)------------------------------------------------------------------------"
echo "READY"
echo "You can push to netlify in order to update your site"
echo "------------------------------------------------------------------------$(tput sgr0)"