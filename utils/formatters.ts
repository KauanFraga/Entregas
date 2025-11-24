export const formatPhone = (value: string): string => {
  // Remove non-digits
  const numbers = value.replace(/\D/g, '');
  
  // Limit to 11 chars
  const char = { 0: '(', 2: ') ', 7: '-' };
  let r = '';
  
  // (XX) XXXXX-XXXX
  for (let i = 0; i < numbers.length; i++) {
    // @ts-ignore
    r += (char[i] || '') + numbers[i];
  }
  
  return r;
};

export const cleanPhoneForAPI = (value: string): string => {
  // Remove non-digits
  let cleaned = value.replace(/\D/g, '');
  
  // If it starts with 55 (Brazil DDI) and is long enough, keep it.
  // If it doesn't start with 55, prepend it.
  if (cleaned.length >= 10 && !cleaned.startsWith('55')) {
    cleaned = '55' + cleaned;
  }
  
  return cleaned;
};

export const validatePhone = (value: string): boolean => {
  const numbers = value.replace(/\D/g, '');
  return numbers.length >= 10 && numbers.length <= 11;
};