/* eslint no-mixed-operators: 0 */  // --> OFF
const bitmate = require('@oligibson/bitmate-generator');

module.exports = bitmate.Base.extend({
  configuring: {
    pkg() {
      this.mergeJson('package.json', {
        devDependencies: {
          eslint: '3.19.0',
          'eslint-config-xo-space': '0.15.0'
        },
        eslintConfig: {
          root: true,
          env: {
            browser: true,
            jasmine: true
          }
        }
      });

      if (this.options.client === 'angular1') {
        this.mergeJson('package.json', {
          devDependencies: {
            'eslint-config-angular': '0.5.0',
            'eslint-plugin-angular': '1.6.4'
          }
        });
      }

      if (this.options.client === 'react') {
        this.mergeJson('package.json', {
          devDependencies: {
            'babel-preset-react': '6.24.1',
            'eslint-config-xo-react': '0.10.0',
            'eslint-plugin-react': '6.10.3'
          },
          eslintConfig: {
            extends: [
              'xo-react/space'
            ]
          }
        });
        if (this.options.modules === 'bower') {
          this.mergeJson('package.json', {
            eslintConfig: {
              globals: {
                React: true,
                ReactDOM: true,
                axios: true
              },
              rules: {
                'react/jsx-no-undef': 0,
                'no-undef': 0, // eslint not compatible with react/inject
                'no-unused-vars': 0 // eslint not compatible with react/inject
              }
            }
          });
        }
      }

      if (this.options.modules === 'webpack') {
        this.mergeJson('package.json', {
          devDependencies: {
            'eslint-loader': '1.7.1',
            'babel-loader': '6.4.1'
          }
        });
      } else {
        this.mergeJson('package.json', {devDependencies: {'gulp-eslint': '3.0.1'}});
      }

      if (this.options.js === 'js') {
        this.mergeJson('package.json', {
          eslintConfig: {
            extends: [
              'xo-space'
            ]
          }
        });
      } else {
        this.mergeJson('package.json', {
          devDependencies: {
            'babel-eslint': '7.2.1',
            'eslint-plugin-babel': '4.1.1'
          },
          eslintConfig: {
            parser: 'babel-eslint',
            extends: [
              'xo-space/esnext'
            ]
          }
        });
      }

      if (this.options.client === 'angular2' && this.options.js !== 'typescript') {
        this.mergeJson('package.json', {
          eslintConfig: {
            rules: {
              'new-cap': 0
            }
          }
        });
      }

      if (this.options.modules === 'bower') {
        if (this.options.client === 'angular1') {
          this.mergeJson('package.json', {
            eslintConfig: {
              globals: {
                angular: true
              }
            }
          });
          if (this.options.sample === 'todoMVC') {
            this.mergeJson('package.json', {
              eslintConfig: {
                rules: {
                  'no-undef': 0, // eslint not compatible with angular/inject
                  'no-unused-vars': 0 // eslint not compatible with angular/inject
                }
              }
            });
          }
        }
        if (this.options.js === 'babel' || this.options.js === 'js' && this.options.client === 'react') {
          this.mergeJson('package.json', {devDependencies: {'gulp-babel': '6.1.2'}});
        }
      }

      if (this.options.client === 'vue') {
        this.mergeJson('package.json', {
          devDependencies: {
            'babel-plugin-transform-object-rest-spread': '^6.23.0',
            'eslint-plugin-html': '^2.0.1',
            'babel-plugin-transform-runtime': '^6.23.0',
            'babel-runtime': '^6.23.0'
          },
          eslintConfig: {
            plugins: ['html']
          }
        });
      }

      if (this.options.modules === 'systemjs') {
        this.mergeJson('package.json', {eslintConfig: {globals: {SystemJS: true}}});

        if (this.options.client === 'angular2') {
          this.mergeJson('package.json', {
            jspm: {
              devDependencies: {
                'babel-plugin-transform-es2015-typeof-symbol': 'npm:babel-plugin-transform-es2015-typeof-symbol@6.23.0',
                'babel-plugin-angular2-annotations': 'npm:babel-plugin-angular2-annotations@5.1.0',
                'babel-plugin-transform-decorators-legacy': 'npm:babel-plugin-transform-decorators-legacy@1.3.4',
                'babel-plugin-transform-class-properties': 'npm:babel-plugin-transform-class-properties@6.23.0',
                'babel-plugin-transform-flow-strip-types': 'npm:babel-plugin-transform-flow-strip-types@6.22.0'
              }
            },
            eslintConfig: {
              globals: {
                __moduleName: true
              }
            }
          });
        } else if (this.options.client === 'react') {
          this.mergeJson('package.json', {jspm: {devDependencies: {'babel-preset-react': 'npm:babel-preset-react@6.24.1'}}});
        }

        if (this.options.js !== 'typescript') {
          this.mergeJson('package.json', {
            jspm: {
              dependencies: {babel: 'npm:babel-core@6.24.1'},
              devDependencies: {'plugin-babel': 'npm:systemjs-plugin-babel@^0.0.21'}
            }
          });
        }
      }

      if (this.options.js === 'babel' || this.options.js === 'js' && this.options.client === 'react') {
        this.mergeJson('package.json', {devDependencies: {'babel-core': '6.24.1', 'babel-polyfill': '6.23.0'}});
      }

      if (this.options.js === 'babel') {
        this.mergeJson('package.json', {devDependencies: {'babel-preset-es2015': '6.24.1'}});
      }
    }
  },

  writing: {
    wiring() {
      if (this.options.client === 'angular1') {
        this.copyTemplate(
          'client/.eslintrc.js',
          'client/.eslintrc.js'
        );
      }
      if (this.options.modules === 'systemjs') {
        this.copyTemplate(
          'gulp_tasks/scripts-full.js',
          'gulp_tasks/scripts.js'
        );
      } else if (this.options.modules === 'bower' && this.options.js !== 'typescript') {
        this.replaceInFileWithTemplate(
          'gulp_tasks/scripts-require.js',
          'gulp_tasks/scripts.js',
          /const gulp = require\('gulp'\);/
        );
        this.replaceInFileWithTemplate(
          'gulp_tasks/scripts-stream.js',
          'gulp_tasks/scripts.js',
          / {2}return gulp\.src[^\n]*/
        );
      }
      this.copyTemplate(
        '.editorconfig',
        '.editorconfig'
      );
    }
  }
});
