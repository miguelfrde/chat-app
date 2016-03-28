export function timestampToString(timestamp) {
  if (!timestamp) {
    return '';
  }
  const now = new Date();
  const time = new Date(timestamp);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  if (now.getDate() === time.getDate() &&
      now.getMonth() === time.getMonth() &&
      now.getFullYear() === time.getFullYear()) {
    return `${withZero(time.getHours())}:${withZero(time.getMinutes())}`;
  }
  return `${withZero(time.getDate())}/${months[time.getMonth()]}/${time.getFullYear()}`;
}

export function withZero(n) {
  return (n < 10)? `0${n}` : n;
}
