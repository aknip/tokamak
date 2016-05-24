// for view component architecture see:
// https://github.com/IjzerenHein/famous-flex-animationcontroller/blob/master/tutorial/AnimationController.md

var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var LayoutController = require('famous-flex/src/LayoutController');

var Plasma = require('./plasma');

function component(options) {
  View.apply(this, arguments);
  _createComponent.call(this, options);
}
component.prototype = Object.create(View.prototype);
component.prototype.constructor = component;

function _createComponent(options) {
  var devicename = options;

  var plasmaLayoutObject = new LayoutController({
    //layout: undefined,
    layoutOptions: {
      globalLayout: Plasma.globalLayout
    },
    flow: true,
    flowOptions: {
      reflowOnResize: false
    },
    dataSource: {
      surf1: new Surface({
        content: Plasma.plasmaIcons.rocket,
        properties: {backgroundColor: 'red'}
      })
    }
  });

  plasmaLayoutObject.plasmaLayoutOptions = {};
  plasmaLayoutObject.plasmaLayouts = {
    phone: function (context, options) {
      context.set('surf1', {
        // options.globalLayout.phone.navbarMainHeight
        size: [context.size[0], context.size[1]],
        translate: [0, 0, 100]
      });
    },
    tablet: function (context, options) {
      context.set('surf1', {
        size: [context.size[1]/3*2, context.size[1]/3*2],
        translate: [(context.size[0]-context.size[1]/3*2)/2, context.size[1]/6, 100]
      });
    },
    desktop: function (context, options) {
      context.set('surf1', {
        size: [context.size[0]/2, context.size[1]/2],
        translate: [context.size[0]/4, context.size[1]/4, 100]
      });
    }
  };

  // set initial layout as defined in function parameter
  plasmaLayoutObject.setLayout(plasmaLayoutObject.plasmaLayouts[devicename]);
  // register layout so that it can be updated later when screen size changes
  Plasma.registerLayout('pimdemo', plasmaLayoutObject);

  this.add(plasmaLayoutObject);

}

module.exports = component;
