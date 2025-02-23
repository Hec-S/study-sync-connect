
export type SchoolTheme = {
  primary: string; // Main brand color
  secondary: string; // Secondary brand color
  background: string; // Main background color
  text: string; // Main text color
  accent: string; // Accent color for highlights
};

export const schoolThemes: Record<string, SchoolTheme> = {
  'UTEP': {
    primary: '#FF7F32', // UTEP Orange
    secondary: '#003B5C', // UTEP Blue
    background: '#003B5C',
    text: '#ffffff',
    accent: '#FF7F32',
  },
  // Add more schools as needed
  'default': {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    background: 'hsl(var(--background))',
    text: 'hsl(var(--foreground))',
    accent: 'hsl(var(--accent))',
  }
};
