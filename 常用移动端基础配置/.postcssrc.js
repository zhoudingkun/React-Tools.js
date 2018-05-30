// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {
    	browsers: ['iOS >= 7', 'Android >= 4.1']
    },
    "postcss-px2rem-exclude": {
    	remUnit: 75,
        exclude: /node_modules/i,
        remPrecision: 3
    }
  }
}
