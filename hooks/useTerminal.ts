import { useState, useEffect } from 'react';

export const useTerminal = () => {
  // In a real application, this would be fetched from a server or URL parameter
  // For this demo, we'll just use a fixed ID
  const [terminalId, setTerminalId] = useState<string | null>('demo-terminal');

  return { terminalId };
};