import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') {
    const filePath = join(process.cwd(), 'node_modules', 'next', 'server.js');
    return {
      format: 'commonjs',
      shortCircuit: true,
      url: pathToFileURL(filePath).href,
    };
  }
  if (specifier.startsWith('@/')) {
    let relativePath = specifier.slice(2);
    // Add extension if missing
    if (!relativePath.endsWith('.js') && !relativePath.endsWith('.jsx')) {
      relativePath += '.js';
    }
    const filePath = join(process.cwd(), relativePath);
    return {
      format: 'module',
      shortCircuit: true,
      url: pathToFileURL(filePath).href,
    };
  }
  return nextResolve(specifier, context);
}
