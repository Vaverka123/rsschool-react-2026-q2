import { useTheme } from '@/context/ThemeContext';

import { MoonIcon } from '@/assets/moonIcon';
import { SunIcon } from '@/assets/sunIcon';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      style={{
        color: 'var(--text-h)',
        border: '1px solid var(--border)',
        background: 'var(--bg)',
      }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer shrink-0"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}

export default ThemeToggle;
