module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '/home/jonjones320/Springboard/Capstone/Trip_Planner/Ranner-Frontend/src/__tests__/setupTest.js'
  ],
  moduleNameMapper: {
    // Handle router mocking
    '^react-router-dom$': '/home/jonjones320/Springboard/Capstone/Trip_Planner/Ranner-Frontend/src/__tests__/__mocks__/react-router-dom.js',
    // Handle CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '/home/jonjones320/Springboard/Capstone/Trip_Planner/Ranner-Frontend/src/__tests__/__mocks__/fileMock.js',
    // Handle module aliases
    '^@/(.*)$': '/home/jonjones320/Springboard/Capstone/Trip_Planner/Ranner-Frontend/src/$1'
  },
  transform: {
    '^.+\\.(js|jsx|mjs)$': ['babel-jest', { configFile: './babel.config.cjs' }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@testing-library|react-router|react-router-dom)/)'
  ],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'mjs'],
  // Add support for ESM
  extensionsToTreatAsEsm: ['.jsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true
};