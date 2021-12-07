module.exports = {
  rootDir: '../admin/__tests__',
  moduleFileExtensions: [ 'js', 'json', 'jsx' ],
  transform: { '^.+\\.(js|jsx)?$': '../../config/jest-transform.js' },
  unmockedModulePathPatterns: [ 'react' ],
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$', 
    '^.+\\.{css,sass,scss}$',
  ],
};