const format_date = (date) => {
  // convert input string to Date object
  const dateValue = new Date(date);
  // note that getMonth() returns zero-based month
  const MM = dateValue.getMonth() + 1;
  const DD = dateValue.getDate();
  const YYYY = dateValue.getFullYear();
  return `${MM}/${DD}/${YYYY}`;
}

module.exports = { format_date };
