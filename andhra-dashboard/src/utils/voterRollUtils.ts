/**
 * Voter Roll Utility Functions
 */

/**
 * Formats household member voter names by omitting the redundant family surname.
 * For Telugu voter rolls, the surname (intiperu) is typically the first word.
 * If a voter has a different surname from the household head, their full name is preserved.
 */
export function formatHouseholdMembers(headOfHouse: string, voters: Array<{ name: string }>): string {
  const headTrimmed = headOfHouse.trim();
  const firstSpaceIdx = headTrimmed.indexOf(' ');
  const familySurname = firstSpaceIdx > 0 ? headTrimmed.slice(0, firstSpaceIdx).trim() : '';

  return voters
    .map((v) => {
      const vName = v.name.trim();
      if (!familySurname) return vName;

      const lowerVName = vName.toLowerCase();
      const lowerSurname = familySurname.toLowerCase();
      if (lowerVName.startsWith(lowerSurname + ' ')) {
        const givenName = vName.slice(familySurname.length).trim();
        return givenName || vName;
      }
      return vName;
    })
    .join(', ');
}
