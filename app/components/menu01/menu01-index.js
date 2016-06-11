require('./menu01.css');

var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var FlexScrollView = require('famous-flex/src/FlexScrollView');
var LayoutController = require('famous-flex/src/LayoutController');
var ListLayout = require('famous-flex/src/layouts/ListLayout');
var Utility = require('famous/utilities/Utility');
var Plasma = require('./../plasma/plasma');

var Menu01detail = require('./menu01-detail');

function component(options) {
  View.apply(this, arguments);
  _createSubComponentListScroll.call(this);
  _createMainComponent.call(this);
}
component.prototype = Object.create(View.prototype);
component.prototype.constructor = component;

component.DEFAULT_OPTIONS = {
    plasmaID: 'menu01',
    mainNav: 'menu01'  
};


function _createMainComponent() {
    
    var that = this;
    var devicename = that.options;
    //
    // MAIN / SOURROUNDING LAYOUT
    //
    
    var headerBackgroundSurf = new Surface({content: '', properties: {backgroundColor: 'red'}, classes: ['roundBox1', 'shadowx2']});
    var contentBackgroundSurf=new Surface({content: '', properties: {backgroundColor: '#ddd'}, classes: ['roundBox1', 'shadowx1']});
    var headline0Surf = new Surface({content: 'HEADLINE', properties: {}, classes: ['xxx']});
    var dot0 = new Surface({content: '', properties: {backgroundColor: 'white'}, classes: ['circle', 'startTileDot0']});
    var dot1 = new Surface({content: '', properties: {backgroundColor: 'white'}, classes: ['circle', 'startTileDot1']});
    var dot2 = new Surface({content: '', properties: {backgroundColor: 'white'}, classes: ['circle', 'startTileDot2']});
    
    
    that.layoutCtrl = new LayoutController({
        flow: true,    // smoothly animates renderables when changing the layout
        flowOptions: {reflowOnResize: false},
        dataSource: {
          headerBackground: headerBackgroundSurf,
          contentBackground: contentBackgroundSurf,
          headline: headline0Surf,
          dot0: dot0,
          dot1: dot1,
          dot2: dot2,
          swiper: that.layoutCtrlListscroll,
          detail: new Menu01detail({name: 'Menu 01 detail'})
        }
    });
    
    that.layoutCtrl.plasmaLayoutOptions = {};
    that.layoutCtrl.plasmaID = that.options.plasmaID;
    that.layoutCtrl.mainNav = that.options.mainNav;

    // Layouts are optimized for CSS performance:
    // No animation of size (slow) - instead use animation of scale, where target scale = 1
     that.layoutCtrl.plasmaLayouts = {
        phone: function (context, options) {
            //console.log('layout menu01');
            //console.log(options);
            switch (options.animationPhase) {
              case 'FROM':
                  //console.log('FROM')
                  var pos0 = options.animPos[0];
                  var pos1 = options.animPos[1];
                  var pos2 = options.animPos[2];
                  var pos3 = options.animPos[3];
                  // TODO:
                  // if(options.animPos && options.animPos[0] != 'undefined') {
                  // if pos = undefined => default positions at mouse position o.ä. ????
                  var scaleX, scaleY;
                  scaleX = (pos0.animW)/(context.size[0]+20);
                  scaleY = (pos0.animH)/(100);
                  context.set('headerBackground', {
                    translate: [pos0.animX, pos0.animY, 20],
                    size: [context.size[0]+20,100],
                    scale: [scaleX,scaleY,1],
                    opacity: 1
                  });
                  scaleX = (pos1.animW)/(context.size[0]+20);
                  scaleY = (pos1.animH)/(context.size[1]+20);
                  context.set('contentBackground', {
                    translate: [pos1.animX, pos1.animY, 5],
                    size: [context.size[0]+20, context.size[1]+20],
                    scale: [scaleX,scaleY,1],
                    opacity: 1
                  });
                  context.set('headline', {
                    translate: [pos2.animX, pos2.animY, 10],
                    size: [context.size[0],20],
                    scale: [1,1,1],
                    opacity: 1
                  });
                  scaleX = (pos3.animW)/(50);
                  scaleY = (pos3.animH)/(50);
                  context.set('dot0', {
                    size: [50,50],
                    translate: [pos3.animX, pos3.animY, 10],
                    scale: [scaleX,scaleY,1],
                    opacity: 1
                  });
                  context.set('dot1', {
                    size: [50,50],
                    translate: [pos3.animX+40, pos3.animY, 10],
                    scale: [scaleX,scaleY,1],
                    opacity: 1
                  });
                  context.set('dot2', {
                    size: [50,50],
                    translate: [pos3.animX+80, pos3.animY, 10],
                    scale: [scaleX,scaleY,1],
                    opacity: 1
                  });
                  context.set('swiper', {
                    translate: [0, 1000, 20],
                    size: [context.size[0], context.size[1]-120],
                    scale: [1,1,1],
                    opacity: 0
                  });
                  context.set('detail', {
                      translate: [0, 1000, 30],
                      size: [context.size[0], 50],
                      scale: [1,1,1],
                      opacity: 0
                  });
                  break;
              case 'TO':
                  context.set('headerBackground', {
                    size: [context.size[0]+20,100],
                    scale: [1,1,1],
                    translate: [-10, -10, 20],
                    opacity: 1
                  });
                  context.set('contentBackground', {
                    size: [context.size[0]+20, context.size[1]+20],
                    scale: [1,1,1],
                    translate: [-10,-10, 5],
                    opacity: 1
                  });
                  context.set('headline', {
                    size: [context.size[0],20],
                    scale: [1,1,1],
                    translate: [40,100, 10],
                    opacity: 1
                  });
                  context.set('dot0', {
                    size: [50,50],
                    scale: [1,1,1],
                    translate: [context.size[0]-70, 120, 10],
                    opacity: 1
                  });
                  context.set('dot1', {
                    size: [50,50],
                    scale: [1,1,1],
                    translate: [context.size[0]-70, 180, 10],
                    opacity: 1
                  });
                  context.set('dot2', {
                    size: [50,50],
                    scale: [1,1,1],
                    translate: [context.size[0]-70, 240, 10],
                    opacity: 1
                  });
                  context.set('swiper', {
                    size: [context.size[0], context.size[1]-120],
                    scale: [1,1,1],
                    translate: [0, 120, 20],
                    opacity: 1
                  });
                  context.set('detail', {
                      translate: [0, context.size[1]-50, 30],
                      size: [context.size[0], 50],
                      scale: [1,1,1],
                      opacity: 1
                  });
                  break;
              case 'HIDE':
                  context.set('headerBackground', {
                    size: [context.size[0]+20,100],
                    translate: [context.size[0]*2, 0, 20],
                    opacity: 1
                  });
                  context.set('contentBackground', {
                    size: [context.size[0]+20, context.size[1]+20],
                    translate: [context.size[0]*2,-10, 5],
                    opacity: 1
                  });
                  context.set('headline', {
                    size: [context.size[0],20],
                    translate: [context.size[0]*2, 0, 10],
                    opacity: 1
                  });
                  context.set('dot0', {
                    size: [50,50],
                    scale: [1,1,1],
                    translate: [context.size[0]*2, 120, 10],
                    opacity: 1
                  });
                  context.set('dot1', {
                    size: [50,50],
                    scale: [1,1,1],
                    translate: [context.size[0]*2, context.size[1]-50, 30],
                    opacity: 1
                  });
                  context.set('dot2', {
                    size: [50,50],
                    scale: [1,1,1],
                    translate: [context.size[0]*2, 240, 10],
                    opacity: 1
                  });
                  context.set('swiper', {
                    size: [context.size[0], context.size[1]-120],
                    translate: [context.size[0]*2, 120, 20],
                    opacity: 1
                  });
                  context.set('detail', {
                      translate: [0, 1000, 30],
                      size: [context.size[0]*2, 50],
                      scale: [1,1,1],
                      opacity: 1
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


function _createSubComponentListScroll() {
    
    var that = this;
    var devicename = that.options;
    
    var IconDotsVertical = '<svg class="svgIcon" fill="#FFFFFF" viewBox="0 0 24 24" width="100%"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>';
    var IconArrowRight = '<svg class="svgIcon" fill="#FFFFFF" viewBox="0 0 24 24" width="100%"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
    var vertScrollViews = [];
    

    // Create inner scrollview
    function _createMainMenuSubScrollView (config) {
        var vertScrollView = new FlexScrollView({
            autoPipeEvents: true,
            flow: true,    // smoothly animates renderables when changing the layout
            useContainer: true, // wraps scrollview inside a ContainerSurface
            layout: ListLayout,
            layoutOptions: {
                // callback that is called by the layout-function to check
                // whether a node is a section
                isSectionCallback: function(renderNode) {
                    return renderNode.isSection;
                },
                margins: [0, 0, 0, 0]
            },
            touchMoveDirectionThreshold: 0.5
        });
        
        
        //
        // Individual layout element of scroll list
        
        for(var i = 0; i < config.itemCount; i++) {
            var layoutA = function (context, options) {
                context.set('card', {
                    size: [context.size[0]-50, 4200],
                    translate: [50, 38, 10]
                })
            }
            
            var cardSurface = new Surface({content: that.options.name + ' / ' + config.name + ', Nr. '+i + '<br>Link to: ' + ((i%2==0) ? 'MAIN' : 'MENU 01'), classes: ['card'+i]});
            cardSurface.on('click', function(el){
                if (this%2==0) {
                    Plasma.navigator({mainNav: 'startpage', subNav: 0, animPos: []})
    
                }
                else {
                    Plasma.navigator({mainNav: 'menu01', subNav: 0, animPos: []})
                }
            }.bind(i));
            var layoutCtrlA = new LayoutController({
                autoPipeEvents: true,
                size: [undefined, 70],
                flow: true,    // smoothly animates renderables when changing the layout
                dataSource: {
                    'card': cardSurface
                }
            });
            layoutCtrlA.setLayout(layoutA);
            vertScrollView.push(layoutCtrlA);
        }
        
        vertScrollViews.push(vertScrollView);
        
        return vertScrollViews[vertScrollViews.length-1]
    }
    
    
    
    var collection = [];
    collection[0] = [
        new LayoutController({
            flow: true,    
            dataSource: {
                'back': new Surface({content: IconDotsVertical, classes: []}),
                'list': _createMainMenuSubScrollView({topSurface: true, name: 'A', itemCount: 12})
            }
        }),
        new LayoutController({
            flow: true,    
            dataSource: {
                'back': new Surface({content: IconDotsVertical, classes: []}),
                'list': _createMainMenuSubScrollView({topSurface: false, name: 'B', itemCount: 16})
            }
        }),
        new LayoutController({
            flow: true,    
            dataSource: {
                'back': new Surface({content: IconDotsVertical, classes: []}),
                'list': _createMainMenuSubScrollView({topSurface: false, name: 'C', itemCount: 16})
            }
        })
        
    ]
    
    for(var i = 0; i < collection[0].length; i++) {
        _setLayoutMainMenu(i);
    }
    // setLayout in a second step to bind it to the LayoutController and to get correct scoped 'i'-variable
    function _setLayoutMainMenu(i) {
        collection[0][i].setLayout(function (context, options) {
            
            context.set('back', {
                size: [context.size[0]-20, context.size[1]-50],
                translate: [40, 0, 0]
            });
            context.set('list', {
                size: [context.size[0]+30, context.size[1]-90],
                translate: [0, 40, 10]
                
            });
            
        }.bind(collection[0][i]));  // bind !
        collection[0][i].indexPosition = i;
        collection[0][i].scrollOffset = 0;
        
    }
    
    
    that.layoutCtrlListscroll = new FlexScrollView({
            dataSource: collection[0],
            flow: true,    // smoothly animates renderables when changing the layout
            layout: ListLayout,
            direction: Utility.Direction.X, // set direction to horizontal
            paginated: true,
            touchMoveDirectionThreshold: 0.5,
            useContainer: true, // wraps scrollview inside a ContainerSurface
            debug: true,
            mouseMove: true
        })
    
    
    that.layoutCtrlListscroll.on('scrollend', function(event) {
        //console.log('scrollend: ' + this.layoutCtrl.getCurrentIndex()) 
        //var newSubNav = {subNav: swipeLayoutCtrl.getCurrentIndex()}; 
        //document.dispatchEvent(new CustomEvent('action', { detail: { type: 'GOTO', params: newSubNav }}))
    }.bind(that));
   
    
}


module.exports = component;

