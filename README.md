# tokamak
based on plasma.
changed in ws

- Simple template for quick development
- Supports HMR (automatic reload)
- Supports automatic deletion of debug code (logging) during productin build. 
  In source code write: if (config.loggingMode == 'dev') { ... }  
  Webpack will use webpack.DefinePlugin to set the config.loggingMode variable
  See https://reactjsnews.com/how-to-make-your-react-apps-10x-faster
- Based on http://survivejs.com/webpack_react/developing_with_webpack/ and http://andrewhfarmer.com/webpack-hmr-tutorial/


## Install
- npm install
- npm run start
- open URL reported to terminal in webbrowser


<dl><br><br></dl>

## Commands

#### Run dev server with HMR / Reload
> npm run devserver

Important: Always use http-protocol for HMR-preview in the browser: http://webpack2016-aknip.c9users.io/index.html
Does NOT WORK with https addresses (eg. cloud 9 default preview). 

#### Run dev server (static)
> npm run prod

#### Build for production (incl. minify):
> npm run build

<dl><br><br></dl>

## Animation notes
- Use 'scale' to animate the size of a surface over time, don't use 'size' ! http://famous.org/learn/sizing.html


## Notes
- Redux Pattern in vanilla JS: https://k94n.com/gordux-js-the-redux-pattern-in-vanilla-js
-- Immutable object copy: https://blog.andyet.com/2015/08/06/what-the-flux-lets-redux/
-- Destructuring assignment obj = {...obj, something: 'some other value'} : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
-- 
- Listen for history change to detect back button with window.onpopstate:  http://lawrencenaman.com/backbone/backbone-browser-back-button-detection/ and http://stackoverflow.com/questions/18211984/how-to-control-back-button-event-in-jquery-mobile/18213393#18213393
-
- Simple Router in 20 lines: http://joakim.beng.se/blog/posts/a-javascript-router-in-20-lines.html
- 
- For HMT Hot Module Replacement and "Side Effects" see http://andrewhfarmer.com/webpack-hmr-tutorial/
- 
- Famo.us: remove objects from render tree (for HMT): 
-- http://stackoverflow.com/questions/23087980/how-to-remove-nodes-from-the-render-tree
-- http://stackoverflow.com/questions/23623586/how-to-remove-surfaces-from-a-layout

- Manual webpack command: >webpack ./app/index.js ./build/bundle.js

##Testing
- npm run testserver (in new terminal tab), open with port 8081
- OR: npm run devtestserver (to start devserver and testserver together)
- Mocha and Webpack config: http://stackoverflow.com/a/32818758 and https://www.youtube.com/watch?v=_sLLjPzOrXI

## Idea 1 for animating from a scrollviewitem to a detailview
- see: https://ide.c9.io/aknip/famousflex, file animation.html, line 400:
- get scrollview-index-nr. of clicked item, change layout to detailview
- problem: scrollview is cropped with "css-overflow:hidden", needs to be reset manually ('hacky'...)
// change Layout of single item
var clickedIndex = parseInt(el.srcElement.className.substr(19));
var clickedObj = vertScrollViews[0].get(clickedIndex);
// get (relative) position of clicked item
var curPosY = vertScrollViews[0].getSpec(clickedObj, false).transform[13];
var layoutOld = clickedObj.getLayout();
...
clickedObj.setLayout(detailview-layout);
...
// Hack: deactivate clipping container of scrollview...
var tmp1 = document.querySelectorAll('[style*="overflow: hidden"]');
tmp1[0].style.overflow="visible"


## URL / state concept

// OLD:
var initState = {mainNav: 'startpage', subNav: 0, animPos: []};

// NEW:
// green card shown, lifted up
mainNav: 'startpage', subNav: 1, detail: [cardup: false, cardup: true], animPos: []

// two detail cards shown, the first one clicked/full screen, the second one small at the bottom
mainNav: 'menu01', subNav: 0, detail: [{content: 47, show: full}, {content: 12, show: small}], animPos: []



## Material Design Lite
Example from startpage-index.js
important: configure webpack via 'includePaths' to support @import from path ./node_modules in .scss
so only the modified .scss-files are in the app, the rest is imported from the original sources
// Use original scss from node module:
require('material-design-lite/src/material-design-lite-grid.scss');
// Use customized scss from app:
require('./../app/material-design-lite-grid.scss');



## git Notes
http://slides.com/alexandraulsh/build-your-own-website-with-cloud9-and-github-pages#/
https://github.com/blog/2019-how-to-undo-almost-anything-with-git

git add --all
git commit -m "first commit"
git push origin master

for a shortcut add this lines to .git/config in this project:
[alias]
    cmp = "!f() { git add -A && git commit -m \"$@\" && git push; }; f"
Usage in terminal: git cmp "Long commit message goes here"

git pull

git status

CREATE BRANCH:
# Create a new branch
git branch branchname

# Switch to the new branch
git checkout branchname


MERGE BRANCH:
# Check out the master branch
git checkout master

# Merge the CSS branch with the master branch
git merge css

# Push changes from merge back to master branch on Github
git push origin master



DELETE BRANCH:
# Delete the remote branch on Github
git push origin --delete css

# Delete the local branch
# -d = "Delete"
git branch -d css

# View available branches
git branch


Removed npm modules:
"css-loader": "^0.23.1",