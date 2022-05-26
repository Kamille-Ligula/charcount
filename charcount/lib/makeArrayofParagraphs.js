exports.makeArrayofParagraphs = (data) => {
  const array = data.split('\n').filter(e => e);
  for (let i=0; i<array.length; i++) {
    array[i] = array[i].replace(/\s/g, '');
  }
  return array;
}
