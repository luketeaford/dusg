const test = require('tape')
const getPath = require('../lib/get-path')

test('The getPath function returns a string of directories from a file path.', t => {
  t.equal(getPath('./ok/sure/fine/whatever/index.html'), './ok/sure/fine/whatever')
  t.end()
})
