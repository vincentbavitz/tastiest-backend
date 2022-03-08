/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const glob = require('glob');
const lodash = require('lodash');

// Pull out PRISMA model types from ./generated and package them.
const data = fs.readFileSync(__dirname + '/generated/index.d.ts', 'utf8');
const outputFilename = __dirname + '/src/types/models.ts';

const regexModelTypes = new RegExp(
  /(?:\/\*\*\n\s\*\sModel\s[\w]*\n\s\*\s\n\s\*\/\n)([\s\S]*?)(?:\})/,
  'gm'
);

const matches = data.match(regexModelTypes);
const usedCustomTypes = [];

let horusTypesFileContent = '';

matches.forEach((match) => {
  // Replace Prisma types of Prisma.*
  match = match
    .replace(/Prisma.Decimal/gm, 'number')
    .replace(/Prisma.JsonValue/gm, 'any');

  // Replace model names; eg User -> HorusUser
  match = match.replace(
    /(?:export type )(.*?)(?:\s\=\s\{)/gm,
    'export type Horus$1 = {'
  );

  // Eg: `picture: Media`
  const linesWithCustomTypes = match.match(
    /(?:\/\*\*\n[\s]*\*\stype\s[\w.]*\n[\s]*\*\/\n[\s]*)(.*)(?:)/gm,
    ''
  );

  // Replace something like
  // type OrderPrice\n   */\n  price: Prisma.JsonValue"
  // with something like
  // price: OrderPrice
  linesWithCustomTypes?.forEach((line) => {
    const newTypeName = line.replace(
      /(?:[\s\S]*?type\s)([\w.]*)(?:[\n\s\S]*)/gm,
      '$1'
    );

    // Add to our list of custom types so we can import them in the output document.
    if (!usedCustomTypes.includes(newTypeName)) {
      usedCustomTypes.push(newTypeName);
    }

    // Remove the above comment about the type.
    let cleanedLine;
    cleanedLine = line.replace(/\/\*\*[\s\S]*?\*\/\n\s\s/gm, '');

    // Add the new type name in place.
    cleanedLine = cleanedLine.replace('any', newTypeName);
    columnName = cleanedLine.replace(/\:.*$/, '');

    // Now we add all the lines back into the match.
    matcher = `(?:\\/\\*\\*\\n[\\s]*\\*\\stype\\s${newTypeName}*\\n[\\s]*\\*\\/\\n[\\s]*)(${columnName}.*)(?:)`;
    lineSelelector = new RegExp(matcher, 'gm');

    match = match.replace(lineSelelector, cleanedLine);
  });

  horusTypesFileContent += match + '\n\n\n';
});

// (?:\/\*\*\n[\s]*\*\stype\s[\w]*\n[\s]*\*\/\n[\s]*)([\w]*:)(?:)

const fileHeaderContent = `/* eslint-disable prettier/prettier */
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/////////////////////     THIS FILE IS AUTO-GENERATED.   //////////////////////
/////////////////////             DO NOT EDIT            //////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
\n`;

// Here is where we give magical imports to models labelled with `/// type SomeType`
// prettier-ignore
const fileTypeImports = `import {\n  ${usedCustomTypes.join(',\n  ')}\n} from '../index';\n\n\n`;

fs.writeFileSync(
  outputFilename,
  fileHeaderContent + fileTypeImports + horusTypesFileContent
);
