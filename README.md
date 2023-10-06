# AFontizer

GFontizer is a simple Node.js script to download Adobee TypeKit Fonts for local provisioning. It's useful in situations where you need to self-host Adobe Fonts due to privacy policies, offline use, or faster loading times.

## Features

- Downloads Adobe TypeKit Fonts in WOFF2 format
- Generates a CSS file with updated `@font-face` rules
- Removes comments from the CSS file
- Replaces single quotes with double quotes in the CSS file
- Format CSS output file
- Handles multiple fonts and font weights

## Installation

You can install AFontizer via npm:

```sh
npm install afontizer
```

## Usage

To use AFontizer, run the script with the Adobe TypeKit Fonts URL as the first argument:

```sh
afontizer "https://use.typekit.net/bcf3gcu.css"
```

By default, fonts will be downloaded to `./resources/assets/fonts/` and the CSS will be written to `./resources/assets/styles/common/_afonts.scss`. You can specify different paths as the second and third arguments:

```sh
afontizer "https://use.typekit.net/bcf3gcu.css" "./my-fonts/" "./styles/_afonts.scss"
```

## License

AFontizer is licensed under the GPL-3.0-or-later license.