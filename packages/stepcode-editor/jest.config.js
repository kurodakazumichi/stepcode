module.exports = {
  
    globals: {
      'ts-jest': {
        "tsConfig": "tsconfig.json"
      }
    },
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",

    moduleFileExtensions: [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ],
    /** coverageに含めないもの */
    coveragePathIgnorePatterns:['__tools__'],
    /** テストから除外するもの */
    testPathIgnorePatterns: ["__tools__"]
  
}