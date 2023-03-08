/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    //modulePathIgnorePatterns: ["<rootDir>/docs/","<rootDir>/vault/"],

	coverageDirectory: "tests/coverage",
	coverageReporters: ["lcov"],

    modulePaths: ['node_modules','<rootDir>'],
    moduleDirectories: ['node_modules'],
    moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'd.ts', 'tsx', 'json', 'node']

};