# AFontizer

GFontizer is a simple Node.js script to download Adobee TypeKit Fonts for local provisioning. It's useful in situations where you need to self-host Adobe Fonts due to privacy policies, offline use, or faster loading times.

## Features

- Downloads Adobe TypeKit Fonts in WOFF2 format
- Generates a CSS file with updated `@font-face` rules
- Removes comments from the CSS file
- Replaces single quotes with double quotes in the CSS file
- Handles multiple fonts and font weights

## Installation

You can install GFontizer via npm:

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
afontizer "https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" "./my-fonts/" "./styles/_afonts.scss"
```

## License

AFontizer is licensed under the GPL-3.0-or-later license.