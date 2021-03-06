**WebStater** is a code base that can be used to start new scalable Web and Mobile Web applications base code with some simple but scalable best practices to build substantial Web and Mobile Web applications. 

Core philosophies are: 

- Simple scale better. 
- Library over framework. 
- Runtime over high abstraction layers. 

And finally, the DOM is not the enemy for building scalable Web, and Mobile application, how we use (or not use it) is. 

### Technology Approach

- **TypeScript**: An amazing JavaScript superset providing a flexible and robust typing system the JavaScript way. 
- **Rollup**: An minimalistic and efficient Javascript bundler. 
- **PostCss**: The reference in CSS post-processing. 
- **Handlebars**: Robust, Mature, and Extensible template engine. 
- **mvdom**: Minimalistic and Scalable ES6/TS DOM Centric MVC framework (15kb minimized, async based)
- **UI**: For UI style and guidelines, we use **Google Material Design**
- **Modern browsers**: Those best practices are targeted for modern browsers such as Edge, Chrome, Safari, Firefox, Mobile Chrome, and Mobile Safari.
    - For example, those best practices are relying on browser features such as **CSS Variables**, **CSS GRID**, and **JS Promise** **JS Async/Await**. All of those features are transformative in their field and well supported in modern browsers. 
    - (IE 11 could be added with some significant polyfill and css override)

This is a no ~~WebPack~~, ~~Gulp~~, ~~Angular~~  zone. More on the why later, but in short, simple scale better. 

### Docs

- [Doc - CSS Structure and Best Practices](doc/css.md)


### Build, Run, Watch

```
npm install

# build the .js, .css
npm run build 
# or, for live dev, 
npm run watch
```

Got to http://localhost:8080/

### Make it your own

Besides the purpose of sharing some best practices, this repository is also designed to be used as a code base to start new scalable Web and Mobile Web application development. 

To make this project yours do the following: 

```sh
# remove the git (add yours)
rm -Rf .git/

# remove the doc folder 
#  (this is a folder to document the best practices, you can always come back to the web-start repo)
rm -Rf doc/ 
```

### Build System

On the building side, we use simple `npm scripts` with core html / js / css processors (i.e. handlebars, typescript, and postcss)

- For **Css** we use **Postcss** with minimum plugins (mixins, nested, and import)
- For **JS**, we use **TypeScript** (huge dev productivity and code robustness) and **Rollup** for bundling the files
- For **HTML** templates, we use **Handlebars** (robust, mature, and extensible)
- For **MVC**, we use the DOM Centric **mvdom** micro-framework (15kb minimized)

While this approach might seem to simple to scale, by experience, it scales much better as projects get bigger, as it gives the developers full control of the toolchain in pure node.js and is a forcing factor to keep things simple. 

### Code Layout

This is a Web and Mobile Web client-side code structure, and while we have a minimalistic express `server/`, it is just here to make the demo works correctly. Any backend can be used to serve those HTML assets and web request.  

On the client side, we have


- `web/` base dir that will be used by the server to serve the files
    - `tsconfig.json` the web tsconfig file
    - `src/` all of the `.ts` `.pcss` and `.tmpl` (Handlebars) resides
        - `pcss/` common CSS files for the application.
        - `ts/` common ts files, such as the `ajax`, `renderer`, `route` modules. 
        - `views/` all the UI Views resides, with the convention `Component.ts` `Component.pcss` and `Component.tmpl` resides. Also, organized in Folder/ structure based on their common name prefix.                 
        - `lib-bundle.js` This is where we have 3rd party dependencies and will be bundled by rollup as `web/js/lib-bundle.js` (this allows to keep the `app-bundle.js` smaller)
    - `index.html` the HTML file
    - `svg/...` the SVG files, usually generated by an external tool. Should be committed
    - `CSS/` and `js/` those are the compiled CSS and js files and is in the `.gitignore` to avoid team member unnecessary merge conflicts. 
- `scripts/` Where the npm scripts are located to build and watch the code. 
- `build.yaml` is a simple yaml file used by the `scripts/build` to define the building blocks. Can be extended as the dev team needs. Starting this way, allow to start simple and add just the needed complexity rather than trying to understand solve-it-all tooling. Also, the solve-it-all tools can still be used in the background. 
- `tsconfig.json` the tsconfig for the scripts file.

**Note:** For now, we have the same `package.json` for the scripts and the web. Could have had a `web/package.json` with the web only dependencies. 



