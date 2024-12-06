export function formatDate(
  dateStr: string,
  format: string = "DD Mon YYYY"
): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Numeric month
  const day = date.getDate().toString().padStart(2, "0"); // Day of the month
  const monthShortName = date.toLocaleString("default", { month: "short" }); // Short month name (e.g., "Jan")

  // Replace placeholders in the format string
  return format
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day)
    .replace("Mon", monthShortName);
}
