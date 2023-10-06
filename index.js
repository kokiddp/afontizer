#!/usr/bin/env node

const fs = require('fs');
const axios = require('axios');
const path = require('path');
const urlModule = require('url');
//const beautify = require('jsbeautify');

const cssUrl = process.argv[2] || null;
const destinationFolder = process.argv[3] || './resources/assets/fonts/';
const cssOutputPath = process.argv[4] || './resources/assets/styles/common/_afonts.scss';

const downloadFontsAndCreateStylesheet = async (
  url,
  destinationFolder = './resources/assets/fonts/',
  cssOutputPath = './resources/assets/styles/common/_afonts.scss'
) => {
  try {
    // Ensure the destination folder exists
    fs.mkdirSync(destinationFolder, { recursive: true });

    // Download the CSS file
    const response = await axios.get(url);
    let combinedCssText = response.data;

    // Remove comments
    combinedCssText = combinedCssText.replace(/\/\*[\s\S]*?\*\//g, '');

    // Find all font file URLs
    const fontUrls = combinedCssText.match(/url\("(https:\/\/use\.typekit\.net[^"]+)"\)\sformat\("woff2"\)/g);

    // Iterate URLs and download each file
    for (const fontUrl of fontUrls) {
      const actualUrl = fontUrl.slice(5, -18);
      const primerValue = new urlModule.URLSearchParams(new urlModule.URL(actualUrl).search).get('primer');
      const fvdValue = new urlModule.URLSearchParams(new urlModule.URL(actualUrl).search).get('fvd');
      const vValue = new urlModule.URLSearchParams(new urlModule.URL(actualUrl).search).get('v');
      const filename = primerValue + '_' + fvdValue + '_' + vValue + '.woff2';
      const localPath = path.join(destinationFolder, filename);
      const { data } = await axios.get(actualUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(localPath, data);
      console.log(`Downloaded ${filename}`);
      // Update URL in CSS
      const relativePath = path.relative(path.dirname(cssOutputPath), localPath);
      combinedCssText = combinedCssText.replace(actualUrl, relativePath);
    }

    // Remove the first @import line and the .tk-* CSS block
    combinedCssText = combinedCssText.replace(/@import[^;]+;/, '').replace(/\.tk-[^{]+{[^}]+}/, '');

    // Remove all the non-woff2 font URLs
    combinedCssText = combinedCssText.replace(/,url\("[^"]+"\)\sformat\("woff"\)[^;]*|,url\("[^"]+"\)\sformat\("opentype"\)[^;]*/g, '');

    combinedCssText = formatCss(combinedCssText);

    // Add a newline before each @font-face except the first
    //combinedCssText = combinedCssText.split('@font-face').join('\n@font-face').replace('\n', '');

    // Ensure the destination folder for the CSS file exists
    fs.mkdirSync(path.dirname(cssOutputPath), { recursive: true });

    // Save the new CSS file
    fs.writeFileSync(cssOutputPath, combinedCssText);
    console.log(`Stylesheet created at ${cssOutputPath}`);
  } catch (error) {
    console.error(error);
  }
};

function formatCss(cssText) {
  // Replace all single quotes with double quotes
  cssText = cssText.replace(/'/g, '"');

  // Splitting directives into new lines
  cssText = cssText.replace(/;/g, ';\n')

  // Adding newline after opening brace and before closing brace
  cssText = cssText.replace(/{/g, '{\n  ');
  cssText = cssText.replace(/}/g, '\n}');

  // Removing indent from the lines with braces
  cssText = cssText.replace(/  {/g, '{');
  cssText = cssText.replace(/  }/g, '}');

  // Adding a space after colon
  cssText = cssText.replace(/:/g, ': ');

  // Remove trailing whitespaces
  cssText = cssText.replace(/\s+$/gm, '');
  
  // Replace all multiple newlines with a single newline
  cssText = cssText.replace(/\n{2,}/g, '\n');

  // Add a newline after closing brace
  cssText = cssText.replace(/}/g, '}\n');

  // Remove the leading newline
  cssText = cssText.trimStart();

  // Format the css with a 2-spaces indent
  cssText = cssText.split('\n').map(line => '  ' + line).join('\n');

  // Remove the leading spaces before the @font-face block
  cssText = cssText.replace(/\n  @font-face/g, '\n@font-face');

  // Remove the leading spaces before the closing brace
  cssText = cssText.replace(/\n  }/g, '\n}');

  return cssText;
}

downloadFontsAndCreateStylesheet(cssUrl, destinationFolder, cssOutputPath);
