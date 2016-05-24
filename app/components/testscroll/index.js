var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var FlexScrollView = require('famous-flex/src/FlexScrollView');
var LayoutController = require('famous-flex/src/LayoutController');
var ListLayout = require('famous-flex/src/layouts/ListLayout');

function component(options) {
  View.apply(this, arguments);
  _createComponent.call(this, options);
}
component.prototype = Object.create(View.prototype);
component.prototype.constructor = component;

function _createComponent(options) {
    var plasmaLayoutObject = new FlexScrollView({
        autoPipeEvents: true,
            useContainer: true, // wraps scrollview inside a ContainerSurface
            layout: ListLayout,
            layoutOptions: {
                margins: [0, 0, 0, 0]
            },
            touchMoveDirectionThreshold: 0.5
        });

    for(var i = 0; i < 20; i++) {
        var layoutA = function (context, options) {
            context.set('background', {
                size: [context.size[0]/3, 70],
                translate: [10, 0, 0]
            });
            context.set('card', {
                size: [context.size[0]/3, 68],
                translate: [10, 5, 10]
            });
        }
        var layoutCtrlA = new LayoutController({
            layout: layoutA,
            autoPipeEvents: true,
            size: [undefined, 70],
            flow: true,    // smoothly animates renderables when changing the layout
            dataSource: {
                'background': new Surface({properties: {backgroundColor: '#fff'}}),
                'card': new Surface({content: 'Individual layout! Surface '+i, properties: {backgroundColor: '#ccc'}, classes: ['xxx']})
            }
        });
        plasmaLayoutObject.push(layoutCtrlA);
    }
        
    //var Surf = new Surface({content: 'HELLO ', properties: {backgroundColor: 'red'}});    

    this.add(plasmaLayoutObject);
}


module.exports = component;