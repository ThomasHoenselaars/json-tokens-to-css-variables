"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const a = require("./data/design-tokens.tokens.json");
const fs = require("fs");
const tokens = a;
const convertTokensToCSS = (tokens) => {
    const css = Object.keys(tokens).reduce((tokenValues, key) => {
        const values = Object.keys(tokens[key]).reduce((acc, value) => {
            const entry = tokens[key][value];
            // check for nested tokens
            if (!entry.value) {
                const deepValues = Object.keys(entry).reduce((acc, v) => {
                    // @ts-ignore
                    const deepVal = tokens[key][value][v];
                    return {
                        ...acc,
                        [`--${key}-${value}-${v}`]: `${deepVal.value};`
                    };
                }, {});
                return {
                    ...acc,
                    ...deepValues,
                };
            }
            else {
                // non-nested tokens
                return ({
                    ...acc,
                    [`--${key}-${value}`]: `${tokens[key][value].value};`
                });
            }
        }, {});
        return {
            ...tokenValues,
            ...values
        };
    }, {});
    return css;
};
const cssString = JSON.stringify(`:root ${JSON.stringify(convertTokensToCSS(tokens))}`, null, 2)
    .replace(/,/g, '')
    .replace(/"/g, '')
    .replace(/,\n/g, ';')
    .replace(/\}/g, '}')
    .replaceAll('\\', '');
const writeCSSToFile = (css, fileName) => {
    fs.writeFile(fileName, css, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('wrote css');
    });
};
writeCSSToFile(cssString, 'src/data/design-tokens.css');
//# sourceMappingURL=index.js.map