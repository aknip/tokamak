var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var FlexScrollView = require('famous-flex/src/FlexScrollView');
var LayoutController = require('famous-flex/src/LayoutController');
var ListLayout = require('famous-flex/src/layouts/ListLayout');

var Plasma = require('./../plasma/plasma');

var Menu01 = require('./../menu01/menu01-index');
var Startpage = require('./../startpage/startpage-index');

function component(options) {
  View.apply(this, arguments);
  _createComponent.call(this);
}
component.prototype = Object.create(View.prototype);
component.prototype.constructor = component;

component.DEFAULT_OPTIONS = {
    plasmaID: 'mainApp',
    mainNav: ''
};

component.prototype.redraw = function (store) {
    //TODO: only switch main nav if needed / main nav is different to current scroll state
    this.layoutCtrl.setLayoutOptions({mainNav: store.mainNav});
    this.startpage.layoutCtrl.goToPage(store.subNav);
    this.menu01.layoutCtrl.goToPage(store.subNav);
}

function _createComponent() {
    
    var that = this;
    var devicename = that.options;
    
    that.startpage = new Startpage({name: 'Startpage'});
    that.menu01 = new Menu01({name: 'Menu 01'})
    var mainLayoutElements = {
        'startpageContext': that.startpage, //startpageHorzScrollView,
        'menu01Context': that.menu01, // menu01horzScrollView,
        'homeButton': new Surface({content: 'HOME', properties: {color: '#fff', backgroundColor: '#2c3e50'}})
    }
   
   
    that.layoutCtrl = new LayoutController({
        layoutOptions: {
            subNav: that.options.subNav,
            mainNav: that.options.mainNav,
            globalLayout: Plasma.globalLayout
        },
        flow: true,    // smoothly animates renderables when changing the layout
        flowOptions: {
          reflowOnResize: false
        },
        dataSource: mainLayoutElements
    });
    
    that.layoutCtrl.plasmaLayoutOptions = {};
    that.layoutCtrl.plasmaID = that.options.plasmaID;
    that.layoutCtrl.mainNav = that.options.mainNav;
    
    that.layoutCtrl.plasmaLayouts = {
        desktop: function (context, options) {
            context.set('startpageContext', {
                size: [context.size[0]/2, context.size[1]],
                translate: [100,100,0]
            });
            context.set('menu01Context', {
                size: [context.size[0]/2, context.size[1]],
                translate: [0,0,20]
            });
            context.set('homeButton', {
                size: [60, 60],
                translate: [38, 30, 100]
            });
        },
        phone: function (context, options) {
            context.set('startpageContext', {
                size: [context.size[0], context.size[1]],
                translate: [0,0,0]
            });
            context.set('menu01Context', {
                size: [context.size[0], context.size[1]],
                translate: [0,0,20]
            });
            context.set('homeButton', {
                size: [60, 60],
                translate: [38, 30, 100]
            });
        }
    };
        
    // set initial layout as defined in function parameter
    that.layoutCtrl.setLayout(that.layoutCtrl.plasmaLayouts[devicename]);
    // register layout so that it can be updated later when screen size changes
    Plasma.registerLayout(that.options.plasmaID, that.layoutCtrl); 

    that.add(that.layoutCtrl);
    
}


module.exports = component;