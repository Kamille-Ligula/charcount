const fs = require('fs');

exports.tryToRead = async (location, expectedOutputModel) => {
  try {
    const data = await fs.promises.readFile(location, 'utf8');
    return JSON.parse(data);
  }
  catch (e) {
    console.log(e);
    return expectedOutputModel;
  }
}
