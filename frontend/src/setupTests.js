import '@testing-library/jest-dom';
import { config } from 'react-transition-group';
import { configureAxe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Disable transitions
config.disabled = true;

if (typeof document.createRange !== 'function') {
  document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
  });
}

// See https://github.com/NickColley/jest-axe/issues/147
configureAxe({
  globalOptions: {
    checks: [
      {
        id: 'color-contrast',
        enabled: false,
      },
    ],
  },
});
