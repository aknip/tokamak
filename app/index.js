require('./main.css');

/*
var appCacheNanny = require('appcache-nanny');

// start to check for updates every 30s
appCacheNanny.start()
// The appCache nanny tells you if there is a new update available
appCacheNanny.on('updateready', function() {
  alert('update available!');
});
*/

if (module.hot) {
  module.hot.accept();
}

var Engine = require('famous/core/Engine');
var View = require('famous/core/View');
var Surface = require('famous/core/Surface');

var LayoutController = require('famous-flex/src/LayoutController');
var CollectionLayout = require('famous-flex/src/layouts/CollectionLayout');

var StateModifier = require('famous/modifiers/StateModifier');
var Modifier = require('famous/core/Modifier');
var ContainerSurface = require('famous/surfaces/ContainerSurface');
var Transform = require('famous/core/Transform');
var LinkedListViewSequence = require('famous-flex/src/LinkedListViewSequence');
var Utility = require('famous/utilities/Utility');
var FlexScrollView = require('famous-flex/src/FlexScrollView');
var ListLayout = require('famous-flex/src/layouts/ListLayout');
var Drag = require('famous/physics/forces/Drag');
var RenderNode = require('famous/core/RenderNode');
var RenderController = require("famous/views/RenderController");
//var vflToLayout = require('famous-autolayout/src/vflToLayoutv3');

// Declare here on block level (let) and in all other modules as var to make these objects behave as a global var (pseudo singleton) !
let Plasma = require('./components/plasma/plasma');
//let PlasmaRedux = require('./components/plasma/plasma-redux-router');
//let plasmaRedux = new PlasmaRedux();


// setup Plasma Engine
Plasma.identifyDevice(); // initial device check


// subscribe to state/store changes
document.addEventListener('state', function (){
  console.log('STATE was updated / REDRAWING...');
  
  Plasma.updateStatesInLayoutOptions(Plasma.store);
  //Plasma.animateLayouts();
  
  //console.log(Plasma.history);
  
  
  //TODO: sethash nur, wenn URL sich ändert / vorabprüfung
  //console.log(location.hash.slice(1));
  //console.log(Plasma.store);
});








var AppComponent = require('./components/app/app-index');

// create the main context
var mainContext = Engine.createContext();

var renderController = new RenderController();

var appComponent = new AppComponent(Plasma.store);

Plasma.updateLayouts(); // update all registered layouts


mainContext.add(renderController);

renderController.show(appComponent);

// HMR: Hide (Remove) last node so that when the code runs again and
// adds a new node, we don't end up with duplicate nodes.
if (module.hot) {
  module.hot.dispose(function() {
    console.log('HOT');
    renderController.hide(appComponent);
    //myMenu.render = function(){ return null; }
  });
}

