const printTime = () => {
  let date:Date = new Date;
  let timeString:string = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
  if (timeString[2] === ':') {
    timeString = '[0' + timeString.substring(1);
  }
  if (timeString[5] === ':') {
    timeString = timeString.substring(0,4) + '0' + timeString.substring(4);
  }
  if (timeString[8] === ']') {
    timeString = timeString.substring(0,7) + '0' + timeString.substring(7);
  }
  return timeString;
};

export default printTime;