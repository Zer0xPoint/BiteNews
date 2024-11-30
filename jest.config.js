export default {
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '/node_modules/(?!axios|feedparser|xml2js|node-fetch)/'
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
};
