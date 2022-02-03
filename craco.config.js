
module.exports = {
  webpack: {
    configure: {
      target: 'electron-renderer',
      externals: [
        // Omit all dependencies in app/package.json (we want them loaded at runtime via NodeJS)
        // TODO: jehoon.park 19-08-11 insomnia에서 이것을 사용한 이유가 뭘까 흠..
        // ...Object.keys(pkg.dependencies).filter(name => !pkg.packedDependencies.includes(name)),
    
        // To get jsonlint working...
        'file',
        'system',
      ],
    }
  }
}