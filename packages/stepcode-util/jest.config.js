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
    ]
  
}