const path = require('path');
const { whenProd } = require('@craco/craco');
const babelInclude = require('@dealmore/craco-plugin-babel-include');

/* Allows importing code from other packages in a monorepo. Explanation:
When you use lerna / yarn workspaces to import a package, you create a symlink in node_modules to
that package's location. By default Webpack resolves those symlinks to the package's actual path,
which makes some create-react-app plugins and compilers fail (in prod builds) because you're only
allowed to import things from ./src or from node_modules
 */
const disableSymlinkResolution = {
  plugin: {
    overrideWebpackConfig: ({ webpackConfig }) => {
      webpackConfig.resolve.symlinks = false;
      return webpackConfig;
    },
  },
};

const webpackSingleModulesResolution = {
  alias: {
    react$: path.resolve(__dirname, 'node_modules/react'),
    'react-dom$': path.resolve(__dirname, 'node_modules/react-dom'),
  },
};

const jestSingleModuleResolution = {
  moduleNameMapper: {
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
  },
};

const babel = {
  plugin: babelInclude,
  options: {
    include: ["../src/guillo-gmi"]
  }
}



module.exports = {
  plugins: [babel, ...whenProd(() => [disableSymlinkResolution], [])],
  webpack: webpackSingleModulesResolution,
  jest: {
    configure: {
      jestSingleModuleResolution,
    },
  },
};
