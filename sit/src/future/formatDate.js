function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { month: "long", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export default formatDate;
