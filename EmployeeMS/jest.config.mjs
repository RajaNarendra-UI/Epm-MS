export default {
        testEnvironment: "jsdom",
        setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
        // setupFiles: ["./jest.setup.cjs"],
        transform: {
            "^.+\\.(js|jsx)$": "babel-jest",
            "node_modules/.+\\.(js|jsx)$": "babel-jest"
        },
        transformIgnorePatterns: [
                "node_modules/(?!axios)/"
        ],
        extensionsToTreatAsEsm: ['.jsx'],
        moduleNameMapper: {
            "\\.(css|less|scss|sass)$": "identity-obj-proxy",
            "^axios$": "axios"
        },

        testMatch:["**/_tests_/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
        moduleFileExtensions: ["js","jsx", "json", "node"]

};

// npm install --save-dev @testing-library/react @testing-library/jest-dom identity-obj-proxy babel-jest
// import '@testing-library/jest-dom';


// steps to run test
// 1. npm install --save-dev @testing-library/react @testing-library/jest-dom identity-obj-proxy babel-jest
// 2. npm install --save-dev @babel/preset-env @babel/preset-react
// 3. npm install --save-dev @babel/preset-env @babel/preset-react
// 4. npm install --save-dev @babel/preset-env @babel/preset-react


// npm test
// npm test Login.test.jsx
// npm test -- --watch
// npm test -- --coverage
