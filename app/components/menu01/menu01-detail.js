require('./menu01.css');

var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var FlexScrollView = require('famous-flex/src/FlexScrollView');
var LayoutController = require('famous-flex/src/LayoutController');
var ListLayout = require('famous-flex/src/layouts/ListLayout');
var Utility = require('famous/utilities/Utility');
var Plasma = require('./../plasma/plasma');

function component(options) {
  View.apply(this, arguments);
  _createMainComponent.call(this);
}
component.prototype = Object.create(View.prototype);
component.prototype.constructor = component;

component.DEFAULT_OPTIONS = {
    plasmaID: 'menu01detail',
    visibleForMainNav: 'menu01'  
};


function _createMainComponent() {
    
    var that = this;
    var devicename = that.options;

    //
    // MAIN / SOURROUNDING LAYOUT
    //
    
    var detailBackgroundSurf = new Surface({content: 'xxx', properties: {backgroundColor: 'yellow'}, classes: ['shadowx2']});

    that.layoutCtrl = new LayoutController({
        flow: true,    // smoothly animates renderables when changing the layout
        flowOptions: {reflowOnResize: false},
        dataSource: {
          detailBackground: detailBackgroundSurf
        }
    });
    
    that.layoutCtrl.plasmaLayoutOptions = {};
    that.layoutCtrl.plasmaID = that.options.plasmaID;
    that.layoutCtrl.visibleForMainNav = that.options.visibleForMainNav;

    // Layouts are optimized for CSS performance:
    // No animation of size (slow) - instead use animation of scale, where target scale = 1
     that.layoutCtrl.plasmaLayouts = {
        phone: function (context, options) {
            ////console.log('layout menu01');
            ////console.log(options);
            switch (options.animationPhase) {
              case 'FROM':
                  context.set('detailBackground', {
                      size: [context.size[0],100],
                      scale: [1,1,1],
                      translate: [0, context.size[1]-100, 100],
                      opacity: 1
                  });
                  break;
              case 'TO':
                  context.set('detailBackground', {
                    size: [context.size[0],100],
                    scale: [1,1,1],
                    translate: [0, context.size[1]-100, 100],
                    opacity: 1
                  });

                  break;
              case 'HIDE':
                  context.set('detailBackground', {
                    size: [context.size[0]+20,100],
                    translate: [context.size[0]*2, context.size[1]-100, 100],
                    opacity: 1
                  });

                  break;  
            }
        }
    };  
    
    // set initial layout as defined in function parameter
    //that.layoutCtrl.setLayout(that.layoutCtrl.plasmaLayouts[devicename]);
    // register layout so that it can be updated later when screen size changes
    Plasma.registerLayout(that.layoutCtrl.plasmaID, that.layoutCtrl); 
     
    that.add(that.layoutCtrl);
    
}


module.exports = component;

