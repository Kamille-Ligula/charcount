exports.createRandomString = (firstChars, length, addedLength, charDepth) => {
  const allChars = [
    "abcdefghijklmnopqrstuvwxyz", // depth 0
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ", // depth 1
    "1234567890", // depth 2
    "~!@#$%^&*()_+-=[];,./{}:|<>?", // depth 3
  ];

  let characters = '';

  for (let i=0; i<=charDepth; i++) {
    characters = characters + allChars[i];
  }

  const stringLength = (Math.floor(Math.random() * addedLength))+length;

  let randomString = firstChars;
  for (let i=0; i<stringLength; i++) {
    randomString = randomString + characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomString;
}
