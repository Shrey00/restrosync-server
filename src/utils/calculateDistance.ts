function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function distance(
  loc1: [number, number],
  loc2: [number, number]
): number {
  const rkm = 6371; // Earth's radius in kilometers
  const rm = rkm * 1000; // Earth's radius in meters

  const dLat = toRadians(loc2[0] - loc1[0]);
  const dLon = toRadians(loc2[1] - loc1[1]);

  const lat1 = toRadians(loc1[0]);
  const lat2 = toRadians(loc2[0]);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return rm * c; // distance in meters
}

// Example usage
// const loc1: [number, number] = [46.3625, 15.114444];
// const loc2: [number, number] = [46.055556, 14.508333];

// const distanceInMeters = distance(loc1, loc2);
// console.log(`The distance is: ${distanceInMeters} meters`);
