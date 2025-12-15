let idCounter = 0;

export function generateId(prefix: string = 'kyc'): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
