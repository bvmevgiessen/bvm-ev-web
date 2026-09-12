export function parseDateSafe(dateString: string): Date {
  if (!dateString) return new Date();
  
  // Custom parser to avoid browser inconsistencies (like Safari bugs)
  const parts = dateString.split(/[-T:Z+]/);
  
  if (parts.length >= 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    const day = parseInt(parts[2], 10);
    const hour = parts[3] ? parseInt(parts[3], 10) : 0;
    const minute = parts[4] ? parseInt(parts[4], 10) : 0;
    
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month, day, hour, minute);
    }
  }
  
  return new Date(dateString);
}
