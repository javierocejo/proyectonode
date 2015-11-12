var faker = require('faker');
var result = [];
for (i=1;i<11;i++) {
  result.push({ id: i, name: faker.name.findName() });
}
module.exports = result;
