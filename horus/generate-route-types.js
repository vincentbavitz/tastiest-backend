/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const glob = require('glob');
const lodash = require('lodash');

// type Routes = {
//   GET: string[];
//   POST: string[];
//   DELETE: string[];
//   PATCH: string[];
//   PUT: string[];
// };

const routes = {
  GET: [],
  POST: [],
  DELETE: [],
  PATCH: [],
  PUT: [],
};

const controllers = [];

glob('../src/**/*.controller.ts', (_, files) => {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.

  // For each file, we want to get the routes contained within it.
  files.forEach((file) => {
    const data = fs.readFileSync(file, 'utf8');

    // Get the controller route.
    const controllerRegex = /(?:@Controller\(\')(.*)(?:\'\))/gm;
    const controller = controllerRegex.exec(data)?.[1];

    if (!controller) {
      return;
    }

    controllers.push(controller);

    // Get the routes inside the controller.
    const regexGET = /(?:@Get\(\')(.*)(?:\'\))/gm;
    const regexPOST = /(?:@Post\(\')(.*)(?:\'\))/gm;
    const regexDELETE = /(?:@Delete\(\')(.*)(?:\'\))/gm;
    const regexPATCH = /(?:@Patch\(\')(.*)(?:\'\))/gm;
    const regexPUT = /(?:@Put\(\')(.*)(?:\'\))/gm;

    const allGet = data.match(regexGET)?.map((s) => s.split("'")?.[1]);
    const allPost = data.match(regexPOST)?.map((s) => s.split("'")?.[1]);
    const allDelete = data.match(regexDELETE)?.map((s) => s.split("'")?.[1]);
    const allPatch = data.match(regexPATCH)?.map((s) => s.split("'")?.[1]);
    const allPut = data.match(regexPUT)?.map((s) => s.split("'")?.[1]);

    // d for deduped; kept it short because I hate multiline expressions.
    const dGet = lodash.uniq(allGet);
    const dPost = lodash.uniq(allPost);
    const dDelete = lodash.uniq(allDelete);
    const dPatch = lodash.uniq(allPatch);
    const dPut = lodash.uniq(allPut);

    // Add all routes to their corresponding route designation
    dGet.forEach((match) => routes.GET.push(`${controller}/${match}`));
    dPost.forEach((match) => routes.POST.push(`${controller}/${match}`));
    dDelete.forEach((match) => routes.DELETE.push(`${controller}/${match}`));
    dPatch.forEach((match) => routes.PATCH.push(`${controller}/${match}`));
    dPut.forEach((match) => routes.PUT.push(`${controller}/${match}`));
  });

  // Now that we have all the routes, we want to write
  // a TypeScript .d.ts file containing them all.

  // File content
  const fileHeaderContent = `/* eslint-disable prettier/prettier */
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/////////////////////     THIS FILE IS AUTO-GENERATED.   //////////////////////
/////////////////////             DO NOT EDIT            //////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
\n`;

  let fileContent = '';

  const transformRouteToType = (route) => {
    // Produces a Typescript string template type like   `${users/me}`
    // or like this in the dynamic case, eg users/:uid   `${users}/{string}`
    // const routeTemplate = "`${'" + route + "'}`";

    // Template strings aren't good for intellisense.
    // return route.includes('/:')
    //   ? routeTemplate.replace(/\/:[\w]*'/, "'}/${string")
    //   : `'${route}'`;

    return `'${route}'`;
  };

  if (routes.GET.length) {
    fileContent +=
      `export type HorusRoutesGET =` +
      routes.GET.map((route) => `\n  | ${transformRouteToType(route)}`).join(
        ''
      ) +
      ';\n\n';
  }

  if (routes.POST.length) {
    fileContent +=
      `export type HorusRoutesPOST =` +
      routes.POST.map((route) => `\n  | ${transformRouteToType(route)}`).join(
        ''
      ) +
      ';\n\n';
  }

  if (routes.DELETE.length) {
    fileContent +=
      `export type HorusRoutesDELETE =` +
      routes.DELETE.map((route) => `\n  | '${route}'`).join('') +
      ';\n\n';
  }

  if (routes.PATCH.length) {
    fileContent +=
      `export type HorusRoutesPATCH =` +
      routes.PATCH.map((route) => `\n  | '${route}'`).join('') +
      ';\n\n';
  }

  if (routes.PUT.length) {
    fileContent +=
      `export type HorusRoutesPUT =` +
      routes.PUT.map((route) => `\n  | '${route}'`).join('') +
      ';\n\n';
  }

  const routeFilename = __dirname + '/src/types/routes.ts';

  // Clear file
  fs.writeFileSync(routeFilename, '');

  // Write file header
  fs.appendFileSync(routeFilename, fileHeaderContent);

  // Write GET, POST, DELETE, etc routes to type
  fs.appendFileSync(routeFilename, fileContent);

  // Now we create abstract Horus for all our dynamic routes.
  // const mapRouteToMethodName = (route) => {};

  //   fs.appendFileSync(
  //     routeFilename,
  //     `
  // export class AbstractHorus {
  //   private horus: Horus;
  //   public get: typeof Horus.prototype.get;
  //   public post: typeof Horus.prototype.post;

  //   // Nested properties from our typed routes.

  //   // AUTO-GENERATED METHOD
  //   ${controllers.map(
  //     (c) =>
  //       `public ${c}: {
  //         ${routes.GET.filter((r) => r.startsWith(c)).map((r) => `get${r}`)}
  //     };`
  //   )}

  //   constructor(token: string) {
  //     this.horus = new Horus(token);
  //     this.get = this.horus.get;
  //     this.post = this.horus.post;

  //     this.server = {
  //       getSystemStats: () => this.horus.get('server/system-stats'),
  //     };
  //   }
  // }

  // `
  //   );
});
