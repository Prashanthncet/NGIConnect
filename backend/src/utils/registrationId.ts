export function generateRegistrationId(shortName: string = "NGI"): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `NGI-${shortName.toUpperCase()}-${year}-${random}`;
}

