export function generateOrderId() {
  const prefix = "ORD";
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSegment = Math.floor(Math.random() * 1_000_000)
    .toString(36)
    .toUpperCase();

  return `${prefix}-${timestamp}-${randomSegment}`;
}

export function getTimestampPlusOneHour() : Date {
  const now = new Date();

  // Convert current date to UTC ISO string and get the timezone offset
  const utcTimestamp = now.toISOString();
  const timezoneOffset = now.getTimezoneOffset() * -1; // in minutes, so negate for positive offset

  // Add 1 hour (3600000 ms) to the current date
  const oneHourLater = new Date(now.getTime() + 3600000);

  return oneHourLater;
}
