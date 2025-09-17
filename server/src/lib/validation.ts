import { z } from 'zod';

// Simple city name validation
export const cityInputSchema = z.object({
  city: z
    .string()
    .min(1, 'City name is required')
    .max(100, 'City name too long')
    .regex(
      /^[a-zA-Z][a-zA-Z\s\-'.,]*[a-zA-Z]$|^[a-zA-Z]$/,
      'City name must start and end with letters'
    )
    .refine((city) => {
      const trimmed = city.trim();
      // Must contain at least one letter
      if (!/[a-zA-Z]/.test(trimmed)) return false;
      // Cannot be only special characters
      if (!/^[a-zA-Z\s\-'.,]+$/.test(trimmed)) return false;
      // Cannot be only numbers
      if (/^\d+$/.test(trimmed)) return false;
      // Cannot be only special characters like -----
      if (/^[\-'.]+$/.test(trimmed)) return false;
      return true;
    }, 'City name must contain letters and be a valid city name')
    .transform((city) => city.trim()),
});

// Validation helper
export const validateCityInput = (input: unknown) => {
  return cityInputSchema.parse(input);
};
