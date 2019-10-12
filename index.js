const fs = require('fs').promises

module.exports = () => {
  fs.writeFile('./index.txt', 'Hello, world!\n')
}
