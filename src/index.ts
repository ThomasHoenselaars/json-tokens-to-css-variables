import * as a from "./data/design-tokens.tokens.json";
import * as fs from 'fs';

type TokenTypes = 'color';

type TokenValues = {
  [key: string]: {
    type: string;
    value: string;
    description: string;
    extensions: {}
  }
}

type DesignTokens = {
  [key in TokenTypes]: TokenValues;
}

const tokens = a as any;

const convertTokensToCSS = (tokens: DesignTokens) => {
  const css = Object.keys(tokens).reduce((tokenValues, key) => {
    const values = Object.keys(tokens[key as TokenTypes]).reduce((acc, value) => {
      const entry = tokens[key as TokenTypes][value];

      // check for nested tokens
      if (!entry.value) {
        const deepValues = Object.keys(entry).reduce((acc, v) => {
          // @ts-ignore
          const deepVal = tokens[key as TokenTypes][value][v];

          return {
            ...acc,
            [`--${key}-${value}-${v}`]: `${deepVal.value};`
          }
        }, {});

        return {
          ...acc,
          ...deepValues,
        }
      } else {
        // non-nested tokens
        return ({
          ...acc,
          [`--${key}-${value}`]: `${tokens[key as TokenTypes][value].value};`
        })
      }

    }, {});

    return {
      ...tokenValues,
      ...values
    };
  }, {});

  return css;
}

const cssString = JSON.stringify(`:root ${JSON.stringify(convertTokensToCSS(tokens))}`, null, 2)
  .replace(/,/g, '')
  .replace(/"/g, '')
  .replace(/,\n/g, ';')
  .replace(/\}/g, '}')
  .replaceAll('\\', '');

const writeCSSToFile = (css: string, fileName: string) => {
  fs.writeFile(fileName, css, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('wrote css');

  });
}

writeCSSToFile(cssString, 'src/data/design-tokens.css');