const config = {
    experimental: {
        forceSwcTransforms: true,
    },
    presets: ['next/babel'],
    plugins: [
        ["babel-plugin-react-compiler", {}]
    ],
};

export default config; 