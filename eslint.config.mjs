import next from "eslint-config-next";

// Next 16 removed `next lint`; lint via the ESLint CLI against this flat config.
// Import eslint-config-next's native flat config directly instead of routing it
// through FlatCompat/@eslint/eslintrc, whose legacy validator crashes on the
// react plugin's circular refs under ESLint 9.
const eslintConfig = [
  ...next,
  {
    // react-hooks@7 ships experimental react-compiler rules as errors. Two fire
    // on patterns that are correct here, so they must not block lint:
    // - set-state-in-effect: providers sync React state to the DOM AFTER mount
    //   on purpose (SSR-safe; a lazy initializer would hydration-mismatch).
    // - immutability: R3F requires mutating uniform .value every frame inside
    //   useFrame, which has no non-mutating equivalent.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "off",
    },
  },
];

export default eslintConfig;
