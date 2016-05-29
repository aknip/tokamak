require('./startpage.css');

var Engine = require('famous/core/Engine');
var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var Transform  = require("famous/core/Transform");
var Transitionable = require("famous/transitions/Transitionable");
var SnapTransition = require("famous/transitions/SnapTransition");
var FlexScrollView = require('famous-flex/src/FlexScrollView');
var LayoutController = require('famous-flex/src/LayoutController');
var ListLayout = require('famous-flex/src/layouts/ListLayout');
var CollectionLayout = require('famous-flex/src/layouts/CollectionLayout');
var Utility = require('famous/utilities/Utility');
var GenericSync = require("famous/inputs/GenericSync");
var MouseSync   = require("famous/inputs/MouseSync");
var TouchSync   = require("famous/inputs/TouchSync");
var Timer =  require("famous/utilities/Timer");

    
var Plasma = require('./../plasma/plasma');
//var PlasmaRedux = require('./../plasma/plasma-redux-router');


function component(options) {
    View.apply(this, arguments);
    _createSubComponentScroll.call(this);
    _createMainComponent.call(this);
  
}
component.prototype = Object.create(View.prototype);
component.prototype.constructor = component;

component.DEFAULT_OPTIONS = {
    plasmaID: 'startpage',   // internal ID
    mainNav: 'startpage'     // determines on which mainNav (URL/store) 
                             // layout-options are updated => plasma.js line 292 
};

function _createMainComponent() {
    
    var that = this;
    var devicename = that.options;
    
    //
    // MAIN / SOURROUNDING LAYOUT
    //
    
    that.layoutCtrl = new LayoutController({
        flow: true,    // smoothly animates renderables when changing the layout
        flowOptions: {reflowOnResize: false},
        dataSource: {startpageScroll: that.layoutCtrlScroll}
    });
    
    that.layoutCtrl.plasmaLayoutOptions = {};
    that.layoutCtrl.plasmaID = that.options.plasmaID;
    that.layoutCtrl.mainNav = that.options.mainNav;
    
    that.layoutCtrl.plasmaLayouts = {
        phone: function (context, options) {
            switch (options.animationPhase) {
                case 'TO':
                    context.set('startpageScroll', {
                        size: [context.size[0], context.size[1]],
                        translate: [0,0,0],
                        opacity: 1
                    });
                    break;
                case 'HIDE':
                    context.set('startpageScroll', {
                        size: [context.size[0], context.size[1]],
                        //translate: [0,context.size[1]*1.5,0]
                        translate: [0,0,0],
                        opacity: 0
                    });
                    break;
            }
            
        }
    };
        
    // set initial layout as defined in function parameter
    that.layoutCtrl.setLayout(that.layoutCtrl.plasmaLayouts[devicename]);
    // register layout so that it can be updated later when screen size changes
    Plasma.registerLayout(that.layoutCtrl.plasmaID, that.layoutCtrl); 

    that.add(that.layoutCtrl);
}


function _createSubComponentScroll() {
    
    var that = this;
    var devicename = that.options;
    
    var collection = [];
    var surfacePage0=new Surface({content: '', properties: {backgroundColor: '#ddd'}, classes: ['roundBox1', 'shadowx1', 'showLink', 'startTileFront0']});
    //surfacePage0.on('click', _clickOnTile('startTileBack0'));
    var surfacePage1=new Surface({content: 'page 2', properties: {backgroundColor: '#ddd'}, classes: ['showLink', 'startTileFront1']});
    var surfacePage2=new Surface({content: 'page 3', properties: {backgroundColor: '#ddd'}, classes: ['showLink', 'startTileFront2']});
    
    var dragCard0 = new Surface({content: '', properties: {backgroundColor: 'red'}, classes: ['roundBox1', 'shadowx2', 'startTileBack0']});
    var dragCard1 = new Surface({content: '', properties: {backgroundColor: 'green'}, classes: ['startTileBack1']});
    var dragCard2 = new Surface({content: '', properties: {backgroundColor: 'blue'}, classes: ['startTileBack2']});
    
    var dot0 = new Surface({content: '', properties: {backgroundColor: 'white'}, classes: ['circle', 'startTileDot0']});
    var dot1 = new Surface({content: '', properties: {backgroundColor: 'white'}, classes: ['circle', 'startTileDot1']});
    var dot2 = new Surface({content: '', properties: {backgroundColor: 'white'}, classes: ['circle', 'startTileDot2']});
    
    var head0 = new Surface({content: 'HEADLINE', properties: {}, classes: ['startTileHead0']});
    
    
    var position = new Transitionable(0);
    var positionOLD = 0;
    
    collection[0] = [
        new LayoutController({
            flow: true,  
            layoutOptions: {dragY: 0},
            dataSource: {
                'back': dragCard0,
                'front':  surfacePage0,
                'head0': head0,
                'dot0': dot0,
                'dot1': dot1,
                'dot2': dot2
            }
        }),
        new LayoutController({
            flow: true,    
            layoutOptions: {dragY: 0},
            dataSource: {
                'back': dragCard1,
                'front':  surfacePage1
            }
        }),
        new LayoutController({
            flow: true,    
            layoutOptions: {dragY: 0},
            dataSource: {
                'back': dragCard2,
                'front':  surfacePage2
            }
        })
    ]
    
    // register sync classes globally for later use in GenericSync
    GenericSync.register({
        "mouse" : MouseSync,
        "touch" : TouchSync
    });
    Transitionable.registerMethod("snap", SnapTransition);
    
    // funnel both mouse and touch input into a GenericSync
    // and only read from the x-displacement
    var sync = new GenericSync(
        ["mouse", "touch"],
        {direction : GenericSync.DIRECTION_Y}
    );
    dragCard0.pipe(sync);
    
    sync.on('update', function(data){
        var currentPosition = position.get();
        var delta = data.delta;
       
        if ((currentPosition + delta < 0) && (currentPosition + delta > -101)) {
            position.set(currentPosition + delta);
            collection[0][0].setLayoutOptions({blockFlow: true})
        }
    });
    sync.on('end', function(data){
        // check if surface is clicked
        // or swiped again when already dragged up before (position = -100)
        if ((data.delta == 0) || (position.get() < -99)){
            if ((Plasma.store.mainNav != 'menu01') || (Plasma.store.subNav != 0) ){
                Plasma.navigator({mainNav: 'menu01', subNav: 0, animPos: [{animClass: 'startTileBack0'}, {animClass: 'startTileFront0'}, {animClass: 'startTileHead0'}, {animClass: 'startTileDot0'}]})  
            }
        } 
        else {
            var currentPosition = position.get();
            var velocity = data.velocity;
            var endPos = 0;
            var blockFlow = false;
            //console.log(data);
            if (currentPosition < -20 && velocity < 0) {
                if (currentPosition < -110) {
                    endPos = currentPosition;
                    blockFlow = false;
                }
                else {
                    endPos = -100;
                    blockFlow = true;
                }
            }
            else {
                if (currentPosition > -80 && velocity > 0) {
                    endPos = 0;
                    blockFlow = true;
                }
                else {
                    if (currentPosition < -20) {
                        endPos = -100;
                        blockFlow = false;
                    }
                    else {
                        endPos = 0;
                        blockFlow = true;
                    }
                }
            }
            position.set(endPos, {   
                method   : 'snap',
                period   : 200,
                velocity : velocity
            });
            collection[0][0].setLayoutOptions({blockFlow: blockFlow})
        }
    });
    
    // Central place / event to push animations/tranistionables to the LayoutOptions
    Engine.on('prerender',function(){
        var positionValue = position.get();
        //var positionActive = position.isActive();
        //if((positionActive==true) || ((positionActive==false) && (positionValue!=0))) {
        if(positionOLD != positionValue){
            // Do Animation only if tranitionable is animating or has specific value (caused by drag action): see above "sync.on('update'..."
            //console.log(positionValue);
            collection[0][0].setLayoutOptions({dragY: positionValue});
            //if (positionValue > -120) {
            if (collection[0][0].getLayoutOptions().blockFlow == true ) {    
                collection[0][0].resetFlowState();
            }
            positionOLD=positionValue;
        }
    })
    
    for(var i = 0; i < collection[0].length; i++) {
        _setLayoutMainMenu(i);
    }
    // setLayout in a second step to bind it to the LayoutController and to get correct scoped 'i'-variable
    function _setLayoutMainMenu(i) {
        collection[0][i].setLayout(function (context, options) {
            
            context.set('back', {
                size: [context.size[0] - 120, context.size[1]-250],
                translate: [60-i*80, 200+options.dragY, 20]
            });
        
            context.set('front', {
                size: [context.size[0]-120+(-0.3*options.dragY), context.size[1]-250+(-0.5*options.dragY)],
                translate: [60-i*80-(-0.15*options.dragY), 200-(-0.3*options.dragY), 0]
            });
            
            context.set('head0', {
                size: [context.size[0]-50,20],
                translate: [60-i*80+10-(-0.08*options.dragY), 200+options.dragY+context.size[1]-250+10-(100+options.dragY), 10]
            });
            
            context.set('dot0', {
                size: [30,30],
                translate: [60-i*80+10-(-0.08*options.dragY), 200+context.size[1]-250-45+(-0.3*0.5*options.dragY), 10]
            });
            
            context.set('dot1', {
                size: [30,30],
                translate: [60-i*80+10-(-0.08*options.dragY)+40, 200+context.size[1]-250-45+(-0.3*0.5*options.dragY), 10]
            });
            
            context.set('dot2', {
                size: [30,30],
                translate: [60-i*80+10-(-0.08*options.dragY)+80, 200+context.size[1]-250-45+(-0.3*0.5*options.dragY), 10]
            });
            
        }.bind(collection[0][i]));  // bind !
        
    }
    
    
    that.layoutCtrlScroll = new FlexScrollView({
            dataSource: collection[0],
            flowOptions: {
              reflowOnResize: false
            },
            direction: Utility.Direction.X, // set direction to horizontal
            paginated: false,
            touchMoveDirectionThreshold: 0.5,
            useContainer: true, // wraps scrollview inside a ContainerSurface
            debug: true,
            mouseMove: true
        })
    
    that.layoutCtrlScroll.plasmaLayoutOptions = {};
    that.layoutCtrlScroll.plasmaID = that.options.plasmaID + 'Scroll';
    that.layoutCtrlScroll.mainNav = that.options.mainNav;
    
    that.layoutCtrlScroll.plasmaLayouts = {
        desktop: function (context, options) {
            switch (options.animationPhase) {
                case 'TO':
                    break;
                case 'HIDE':
                    break;
            }
            // simple layout-function that lays out renderables from top to bottom
            var node = context.next();
            var x = 0;
            var y = 110;
            var tileSize = context.size[1]/2.5;
            while (node) {
                context.set(node, {
                    size: [tileSize, tileSize],
                    translate: [100+x, y, 20]
                });
                x += tileSize;
                if (x==tileSize*2) { x=0; y +=tileSize}
                node = context.next();
            }
        },
        phone: ListLayout
    };
    
    
    // set initial layout as defined in function parameter
    that.layoutCtrlScroll.setLayout(that.layoutCtrlScroll.plasmaLayouts[devicename]);
    // register layout so that it can be updated later when screen size changes
    Plasma.registerLayout(that.layoutCtrlScroll.plasmaID, that.layoutCtrlScroll); 
    
    that.layoutCtrlScroll.on('scrollend', function(event) {
        //console.log('scrollend: ' + this.layoutCtrlScroll.getCurrentIndex()) 
        //var newSubNav = {subNav: this.layoutCtrlScroll.getCurrentIndex()}; 
        //document.dispatchEvent(new CustomEvent('action', { detail: { type: 'GOTO', params: newSubNav }}))
    }.bind(that)); 
    
}



function _clickOnTile(clickedObj) {
    // return our event handler while capturing an argument in the closure
    return function(el) {
        
        //var clickedObj = 'startTileBack' + parseInt(el.srcElement.className.split("Front").pop());
        
        // get absolute pos of renderable
        // https://github.com/IjzerenHein/famous-flex/issues/48
        //console.log(that.layoutCtrlScroll.getSpec(that.layoutCtrlScroll.get(0), true).transform);
        
        Plasma.navigator({mainNav: 'menu01', subNav: 0, animPos: [{animClass: clickedObj}]})  
    };
}

function _clickOnTile1(el) {
    
    var that = this;
   
    var clickedObj = parseInt(el.srcElement.className.split("Front").pop());
    
    console.log('click on item');
    // get absolute pos of renderable
    // https://github.com/IjzerenHein/famous-flex/issues/48
    //console.log(this.layoutCtrlScroll.getSpec(this.layoutCtrlScroll.get(0), true).transform);
    
    Plasma.navigator({mainNav: 'menu01', subNav: 0, animPos: [{animClass: 'startTileBack'+clickedObj}]})   
    
  
    //document.dispatchEvent(new CustomEvent('action', { detail: { type: 'SET-STATE', params: {mainNav: 1, subNav: 0} }}));
    
    
    return ;
    
   
}




module.exports = component;

