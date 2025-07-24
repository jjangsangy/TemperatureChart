import React from 'react';

export function Footer() {
  return (
    <footer className="w-full py-6 flex items-center justify-center text-sm text-muted-foreground">
      <p>
        Built by{' '}
        <a
          href="https://github.com/jjangsangy/TemperatureChart"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
        >
          jjangsangy
        </a>{' '}
        © {new Date().getFullYear()}.
      </p>
    </footer>
  );
}
