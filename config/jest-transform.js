const config = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
  ],
};

module.exports = require( 'babel-jest' ).default.createTransformer( config );