exports.removeDuplicates = (array) => {
  const arrayfiltered = array.filter(function (el) {
    return el != null;
  });
  const newSet = new Set(arrayfiltered);
  return [...newSet];
}
