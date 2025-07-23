module.exports = {
    experimental: {
        forceSwcTransforms: true,
    },
    presets: ['next/babel'],
    plugins: [
        ["babel-plugin-react-compiler", {}]
    ],
};
