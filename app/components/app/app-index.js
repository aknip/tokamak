var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var FlexScrollView = require('famous-flex/src/FlexScrollView');
var LayoutController = require('famous-flex/src/LayoutController');
var ListLayout = require('famous-flex/src/layouts/ListLayout');
var Timer =  require("famous/utilities/Timer");

var Plasma = require('./../plasma/plasma');

var Menu01index = require('./../menu01/menu01-index');
var Startpage = require('./../startpage/startpage-index');

function component(options) {
  View.apply(this, arguments);
  _createComponent.call(this);
  
  Timer.setTimeout(function(){
      //document.querySelector('.mochaTestreportSurf').classList.add('animated', 'radiusToCorner');
  }, 2000)
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
    this.menu01index.layoutCtrl.goToPage(store.subNav);
}

function _createComponent() {
    
    var that = this;
    var devicename = that.options;
    
    that.startpage = new Startpage({name: 'Startpage'});
    that.menu01index = new Menu01index({name: 'Menu 01 index'});

    var mochaTestreportSurf = new Surface({content: '<div id="mocha"></div>', properties: {backgroundColor: '#ddd'}, classes:['mochaTestreportSurf', 'shadow3', 'animated', 'cornerToRadius']});
    mochaTestreportSurf.on('click', function(el){
        var newZoom = that.layoutCtrl.getLayoutOptions().mochaTestreportZoom;
        //newZoom = (newZoom == 0.5) ? 1.0 : 0.5;
        switch (newZoom) {
            case 0.25:
                newZoom = 0.5;
                document.querySelector('.mochaTestreportSurf').classList.add('radiusToCorner');
                document.querySelector('.mochaTestreportSurf').classList.remove('cornerToRadius');
                break;
            case 0.5:
                newZoom = 1.0;
                break;
            case 1.0:
                newZoom = 0.51;
                break;
            case 0.51:
                newZoom = 0.25;
                document.querySelector('.mochaTestreportSurf').classList.remove('radiusToCorner');
                document.querySelector('.mochaTestreportSurf').classList.add('cornerToRadius');
                break;
        }
        that.layoutCtrl.setLayoutOptions(
            {mochaTestreportZoom: newZoom}
        );
    })

    var mainLayoutElements = {
        'startpageContext': that.startpage, //startpageHorzScrollView,
        'menu01Index': that.menu01index, // menu01horzScrollView,
        'homeButton': new Surface({content: 'HOME', properties: {color: '#fff', backgroundColor: '#2c3e50'}, classes: ['homebutton']}),
        'mochaTestreport': mochaTestreportSurf
    }
   
   
    that.layoutCtrl = new LayoutController({
        layoutOptions: {
            subNav: that.options.subNav,
            mainNav: that.options.mainNav,
            globalLayout: Plasma.globalLayout,
            mochaTestreportZoom: 0.25
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
            context.set('menu01Index', {
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
            context.set('menu01Index', {
                size: [context.size[0], context.size[1]],
                translate: [0,0,20]
            });
            context.set('homeButton', {
                size: [60, 60],
                translate: [38, 30, 100]
            });
            var size, scale;
            switch (options.mochaTestreportZoom) {
                case 0.25:
                    size = [(context.size[0]-100)/4, (context.size[0]-100)/4];
                    scale = [0.5,0.5,1];
                    break;
                case 0.5:
                    size = [(context.size[0]-100)/2, (context.size[0]-100)/2];
                    scale = [0.5,0.5,1];
                    break;
                case 1.0:
                    size = [(context.size[0]-100), context.size[1]];
                    scale = [1,1,1];
                    break;
                case 0.51:
                    size = [(context.size[0]-100)/2, (context.size[0]-100)/2];
                    scale = [0.5,0.5,1];
                    break;    
            }
            context.set('mochaTestreport', {
                size: [context.size[0]-100, (options.mochaTestreportZoom==0.25) ? context.size[0]-100 : ((options.mochaTestreportZoom==1.0) ? context.size[1] : context.size[1]*2/3) ],
                //size: size,
                translate: [(options.mochaTestreportZoom>0.25) ? 20 : -20, 20, 10000],
                origin: [1,0],
                align: [1,0],
                scale: [options.mochaTestreportZoom, options.mochaTestreportZoom, 1],
                //scale: scale
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