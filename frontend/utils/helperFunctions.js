const capitalize = (string) => {
  let words = string.toLowerCase().split(' ');
  words = words.map((el) => {
    return el.charAt(0).toUpperCase() + el.slice(1);
  });
  return words.join(' ');
};

export default capitalize;
