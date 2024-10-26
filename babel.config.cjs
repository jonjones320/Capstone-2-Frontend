module.exports = {
  presets: [
    ['@babel/preset-env', { 
      targets: { node: 'current' },
      modules: 'commonjs'  // Vite defaults to expecting ES JS files. This tells it to use Common Js.
    }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
};