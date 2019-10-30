import typescript from '@fmtk/rollup-plugin-ts';

export default {
  input: './src/index.ts',
  output: [
    {
      file: 'lib/bundle.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'lib/bundle.js',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
  external: id => {
    return !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0');
  },
};
