export const containsSequentialPatterns = (password: string): boolean => {
  const commonPatterns = ["1234", "abcd", "qwerty", "password", "1111", "aaaa"];
  const sequentialPatternRegex =
    /(01234|12345|23456|34567|45678|56789|67890|abcd|bcde|cdef)/i;
  return (
    commonPatterns.some((pattern) =>
      password.toLowerCase().includes(pattern.toLowerCase())
    ) || sequentialPatternRegex.test(password)
  );
};

export const getStrengthColor = (strength: number) => {
  if (strength <= 20) return "bg-red-500";
  if (strength <= 40) return "bg-orange-500";
  if (strength <= 60) return "bg-yellow-500";
  if (strength <= 80) return "bg-lime-500";
  return "bg-green-500";
};

export const getStrengthName = (strength: number) => {
  if (strength <= 20) return "Muy débil";
  if (strength <= 40) return "Débil";
  if (strength <= 60) return "Moderada";
  if (strength <= 80) return "Fuerte";
  return "Muy fuerte";
};
