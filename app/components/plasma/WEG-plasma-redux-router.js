var Plasma = require('./plasma');
//var initState = {mainNav: 0, subNav: 0, mainNavFrom: 0, subNavFrom: 0, divs: {menu0:{div1: ''}, menu1:{div1: '', div2: ''}}};
var initState = {mainNav: 0, subNav: 0, mainNavFrom: 0, subNavFrom: 0, menu0: [{class: 'classA', posX: 2}, {class: 'classB', posX: 99}]};

let PlasmaStore = {
  store: initState,
  initState: initState
}

// Now add methods: 
// Reducer, see https://k94n.com/gordux-js-the-redux-pattern-in-vanilla-js
PlasmaStore.appReducer = function (state, action) {
  var returnState = Object.assign({}, state); // clone object in an immutable way / alternatively: destructuring assignment returnState = {...state, something: 'some other value'} 
  if (typeof returnState === 'undefined') {
    returnState = this.initState
    return returnState
  }
  else {
    switch (action.type) {
      case 'SET-STATE':
        returnState = Object.assign({}, state, action.params);
        return returnState
        //return action.params
        break;
      case 'GOTO':
        returnState.subNav = action.params.subNav;  
        return returnState;
        break;
      case 'INIT':
        returnState = this.initState;
        return returnState
        break;    
      default:
        returnState = this.initState;
        return returnState
    }
    
  }
}


// Router, see http://joakim.beng.se/blog/posts/a-javascript-router-in-20-lines.html
PlasmaStore.router = function (event) {
  // Current route url (getting rid of '#' in hash as well):
  var url = location.hash.slice(1) || '/';
  var urlStore = {};
  var oldStore = {};
  //console.log('HASH CHANGE!');
  var oldHash = event.oldURL || '';
  if (oldHash.indexOf('#') == -1 ) {
    oldHash = encodeURIComponent(JSON.stringify(this.initState))
  }
  else {
    oldHash = oldHash.split("#").pop();
  }
  try {
        urlStore = JSON.parse(decodeURIComponent(url));
        oldStore = JSON.parse(decodeURIComponent(oldHash));
        urlStore.mainNavFrom = oldStore.mainNav;
        urlStore.subNavFrom = oldStore.subNav;
        document.dispatchEvent(new CustomEvent('action', { detail: { type: 'SET-STATE', params: urlStore }}))
      } catch (e) {
        document.dispatchEvent(new CustomEvent('action', { detail: { type: 'INIT' }}))
  }
}

// Event listener for actions
document.addEventListener('action', function(e) {
    this.store = this.appReducer(this.store, e.detail);
    if ( location.hash.slice(1) === encodeURIComponent(JSON.stringify(this.store))) {
      
    }else {
      //console.log('HASH was updated');
      location.hash=encodeURIComponent(JSON.stringify(this.store));
    }
    Plasma.store = Object.assign({}, this.store);
    document.dispatchEvent(new CustomEvent('state'));
    
}.bind(PlasmaStore), false);

// Event listener for router
// Listen on hash change:
window.addEventListener('hashchange', PlasmaStore.router);
// Listen on page load:
window.addEventListener('load', PlasmaStore.router);

/*
// Start with the constructor: Store
function Component() {
    // Store
    var initState = {mainNav: 0, subNav: 0, mainNavFrom: 0, subNavFrom: 0};
    this.store = initState;
    this.initState = initState;
    
    // Event listener for actions
    document.addEventListener('action', function(e) {
        this.store = this.appReducer(this.store, e.detail);
        if ( location.hash.slice(1) === encodeURIComponent(JSON.stringify(this.store))) {
          
        }else {
          //console.log('HASH was updated');
          location.hash=encodeURIComponent(JSON.stringify(this.store));
        }
        document.dispatchEvent(new CustomEvent('state'));
    }.bind(this), false);
    
    // Event listener for router
    // Listen on hash change:
    window.addEventListener('hashchange', this.router);
    // Listen on page load:
    window.addEventListener('load', this.router);
}

// Now add methods: 
// Reducer, see https://k94n.com/gordux-js-the-redux-pattern-in-vanilla-js
Component.prototype.appReducer = function (state, action) {
  var returnState = Object.assign({}, state); // clone object in an immutable way / alternatively: destructuring assignment returnState = {...state, something: 'some other value'} 
  if (typeof returnState === 'undefined') {
    returnState = this.initState
    return returnState
  }
  else {
    switch (action.type) {
      case 'SET-STATE':
        returnState = Object.assign({}, state, action.params);
        return returnState
        //return action.params
        break;
      case 'GOTO':
        returnState.subNav = action.params.subNav;  
        return returnState;
        break;
      case 'INIT':
        returnState = this.initState;
        return returnState
        break;    
      default:
        returnState = this.initState;
        return returnState
    }
    
  }
}


// Router, see http://joakim.beng.se/blog/posts/a-javascript-router-in-20-lines.html
Component.prototype.router = function (event) {
  // Current route url (getting rid of '#' in hash as well):
  var url = location.hash.slice(1) || '/';
  var urlStore = {};
  var oldStore = {};
  //console.log('HASH CHANGE!');
  var oldHash = event.oldURL || '';
  if (oldHash.indexOf('#') == -1 ) {
    oldHash = encodeURIComponent(JSON.stringify(this.initState))
  }
  else {
    oldHash = oldHash.split("#").pop();
  }
  try {
        urlStore = JSON.parse(decodeURIComponent(url));
        oldStore = JSON.parse(decodeURIComponent(oldHash));
        urlStore.mainNavFrom = oldStore.mainNav;
        urlStore.subNavFrom = oldStore.subNav;
        document.dispatchEvent(new CustomEvent('action', { detail: { type: 'SET-STATE', params: urlStore }}))
      } catch (e) {
        document.dispatchEvent(new CustomEvent('action', { detail: { type: 'INIT' }}))
  }
}

*/


module.exports = PlasmaStore;