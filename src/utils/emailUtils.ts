/**
 * Extracts the name part from an email address before the @ symbol
 * @param email - The email address (e.g., "johnemmanuel.pacres@cit.edu")
 * @returns The extracted name (e.g., "johnemmanuel.pacres")
 */
export function extractNameFromEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return 'Voter';
  }
  
  const namePart = email.split('@')[0];
  
  // Convert to title case but preserve periods and underscores
  const formattedName = namePart
    .split(/[._]/) // Split by dots and underscores
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('.'); // Join back with periods
  
  return formattedName || 'Voter';
}

/**
 * Extracts first_name and last_name from an email address.
 * For example, "chuckykorbin.ebesa@cit.edu" => { first_name: "chuckykorbin", last_name: "ebesa" }
 * @param email - The email address
 * @returns An object with first_name and last_name
 */
export function extractFirstAndLastNameFromEmail(email: string): { first_name: string, last_name: string } {
  if (!email || !email.includes('@')) {
    return { first_name: 'Voter', last_name: '' };
  }
  const namePart = email.split('@')[0];
  const [first_name, last_name = ''] = namePart.split('.');
  return { first_name, last_name };
}

/**
 * Prettifies a first name by splitting it in half and adding a space.
 * For example, "chuckykorbin" => "chucky korbin"
 */
export function prettifyFirstName(firstName: string): string {
  if (!firstName) return '';
  if (firstName.includes(' ')) return firstName;
  const mid = Math.floor(firstName.length / 2);
  return firstName.slice(0, mid) + ' ' + firstName.slice(mid);
} 