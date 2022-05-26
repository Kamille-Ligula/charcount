exports.removeDuplicatedObjects = (array, objKey) => {
  const IDsToRemove = [];

  for (let i=0; i<array.length; i++) {
    for (let j=i+1; j<array.length; j++) {
      if (array[i][objKey] == array[j][objKey]) {
        IDsToRemove.push(j);
      }
    }
  }

  IDsToRemove.sort((a, b) => b - a);

  for (let i=0; i<IDsToRemove.length; i++) {
    array.splice(IDsToRemove[i], 1)
  }

  return array;
}
