module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
      // Handle router mocking with custom react-router-dom.
      '^react-router-dom$': '<rootDir>/src/__tests__/__mocks__/react-router-dom.js',
      // Handle CSS imports (if you're using CSS in your components).
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      // Handle image imports.
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/src/__tests__/__mocks__/fileMock.js',
      // Handle module aliases (if you're using them).
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
      '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }]
    },
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
    moduleFileExtensions: ['js', 'jsx'],
    // Optional: Configure coverage
    collectCoverageFrom: [
      'src/**/*.{js,jsx}',
      '!src/main.jsx',
      '!src/vite-env.d.ts',
      '!**/*.d.ts',
      '!**/node_modules/**'
    ],
    transformIgnorePatterns: [
      'node_modules/(?!(@testing-library/jest-dom)/)'
    ]
  };