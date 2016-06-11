
var Engine = require('famous/core/Engine');

var initState = {mainNav: 'startpage', subNav: 0, animPos: []};

let plasma = {
  deviceBreakpoints: {
    // responsive configuration: Breakpoints (list of screen width values) at which different layouts are defined
    phone: 0,
    phablet: 450,
    tablet: 600,
    desktop: 900
  },
  globalLayout : {
    colors: {
      bgdark: '#4a5a6b',
      bgmedium: '#63788f',
      type: '#fff'
    },
    phone: {
      navbarMainHeight: 40,
      navbarSubHeight: 40,
      boxTitlebarHeight: 30,
      sidebarWidth: 100,
      margins: [0,50,20,50],
      columns: 12,
      colGutter: 10
    },
    phablet: {
      navbarMainHeight: 40,
      navbarSubHeight: 40,
      boxTitlebarHeight: 30,
      sidebarWidth: 100,
      margins: [0,50,20,50],
      columns: 12,
      colGutter: 10
    },
    tablet: {
      navbarMainHeight: 30,
      navbarSubHeight: 60,
      boxTitlebarHeight: 30,
      sidebarWidth: 100,
      margins: [0,50,20,50],
      columns: 12,
      colGutter: 10
    },
    desktop: {
      navbarMainHeight: 20,
      navbarSubHeight: 40,
      boxTitlebarHeight: 20,
      sidebarWidth: 100,
      margins: [10,10,10,10],
      columns: 12,
      colGutter: 10
    }
  },
  currentDevice: '',
  previousDevice: '',
  deviceName: '',
  registeredLayouts: {},
  registerLayout: function(name, layout) {
    this.registeredLayouts[name] = layout;
  },
  identifyDevice: function () {
    var device = '';
    for (var i = 0; i < Object.keys(this.deviceBreakpoints).length; i++) {
      var xLow = this.deviceBreakpoints[Object.keys(this.deviceBreakpoints)[i]];
      var xHigh = 99999; // for the last size check in the chain use a fictional / very high value
      if (i == Object.keys(this.deviceBreakpoints).length) {
        xHigh = config[Object.keys(this.deviceBreakpoints)[i + 1]]
      }

      if ((window.innerWidth  > xLow ) && (window.innerWidth  < xHigh )) {
        device = Object.keys(this.deviceBreakpoints)[i];
      }
    }
    if (device != this.currentDevice) this.previousDevice = this.currentDevice;
    this.currentDevice = device;
    this.currentWindowsize = [window.innerWidth, window.innerHeight];
    this.identifyDeviceName();
  },
  identifyDeviceName: function() {
    var effectiveWidth = window.innerWidth * window.devicePixelRatio;
    var sX = screen.width;
    var sY = screen.height;
    var sRes = parseInt(window.devicePixelRatio*100); // cut after 2nd comma position...

    //console.log(sX + " / " + sY + " / " + sRes);

    if ((sX == 360 && sY == 640) || (sX == 640 && sY == 360) && sRes == 300) {
        this.deviceName = 'Note3'
    }

    if ((sX == 360 && sY == 640) || (sX == 640 && sY == 360) && sRes == 400) {
        this.deviceName = 'Note4'
    }

    if ((sX == 412 && sY == 732) || (sX == 732 && sY == 412) && sRes == 350) {
        this.deviceName = 'Note5'
    }

    if (sX == 1440 && sY == 900 && sRes == 200) {
        this.deviceName = 'MacBookPro15'
    }

    if (sX == 1440 && sY == 900 && sRes == 100) {
        this.deviceName = 'MacBookAir13'
    }


    if (sX == 505 && sY == 505 && sRes == 285) {
        this.deviceName = 'BlackBerryPassport'
    }

    // default
    var currentDevice = "phone";

    if (window.innerWidth == window.innerHeight) {
        // Hochformat & Querformat
        if (this.deviceName == 'BlackBerryPassport') {
            currentDevice = "phone";
        }

    }
    else
    {
        if (window.innerWidth < window.innerHeight) {
            // Hochformat
            if (this.deviceName == 'Note3' || this.deviceName == 'Note4' || this.deviceName == 'Note5') {
                //currentDevice = "phabletPhonePortrait";
                currentDevice = "phone"; // JUST A QUICK TEMPORARY CHECK...
            }

        } else {
            // Querformat
            if (this.deviceName == 'Note3' || this.deviceName == 'Note4' || this.deviceName == 'Note5') {
                //currentDevice = "phabletPhoneLandscape";
                currentDevice = "phone"; // JUST A QUICK TEMPORARY CHECK...
            }

        }
    }
    if (this.deviceName == 'MacBookPro15' || this.deviceName == 'MacBookAir13' || this.deviceName == '') {
        if (window.innerWidth > 960) {
            currentDevice = "desktop"; // desktopXL
        }
        else {
            if (window.innerWidth > 800) {
                currentDevice = "tablet"; //tabletLandscape
            }
            else {
                if (window.innerWidth > 700) {
                    currentDevice = "phablet"; //phabletPhoneLandscape
                }
                else {
                    currentDevice = "phone"; //smallPhonePortrait
                }
            }
        }
    }
    
    //this.currentDevice = currentDevice

  },
  getBestLayout: function(layout, device){
    // searches for the best fitting layout for a given device
    // if not found as an explicit layout search for the best fit: 'mobile first' approach
    var result = undefined;
    if ((layout.plasmaLayouts[device]) != undefined) {
      // layout for this device found
      result = device;
    }
    else {
      // no exact match: search for 'best fit'
      var deviceNr = 0;
      // loop through all possible devices and search for device and its position (i)
      for (i = Object.keys(plasma.deviceBreakpoints).length-1; i >=0 ; i--) {
        if (Object.keys(plasma.deviceBreakpoints)[i]==device) {
          deviceNr = i;
          break;
        }
      }

      // beginning with position (i) search 'downwards' in the layouts configuration: 'mobile first' approach
      for (var i = deviceNr; i >= 0; i--) {
        var searchName = Object.keys(plasma.deviceBreakpoints)[i];
        if (layout.plasmaLayouts[searchName] != undefined) {
          deviceNr = i;
          break;
        }
      }
      result = Object.keys(plasma.deviceBreakpoints)[deviceNr];

    }

    return result
  },
  updateLayouts: function() {
    //cycle through registered components
    for (var i = 0; i < Object.keys(this.registeredLayouts).length; i++) {
      var data = {};
      data.controllerName = Object.keys(this.registeredLayouts)[i];
      data.controller = this.registeredLayouts[Object.keys(this.registeredLayouts)[i]];
      data.deviceLayout = this.getBestLayout(data.controller, this.currentDevice);
      
      data.controller.setLayout(data.controller.plasmaLayouts[data.deviceLayout]);
      
      if (data.controller.plasmaLayoutOptions[data.deviceLayout] != undefined) {
        data.controller.setLayoutOptions(data.controller.plasmaLayoutOptions[data.deviceLayout]);
      }
    }
  },
  animateLayouts: function() {
    //cycle through registered components
    //console.log(this.registeredLayouts.menu01)
    
    
  },
  animateLayoutsWEG: function() {
    //cycle through registered components
    console.log(this.registeredLayouts.menu01)
    
    
    for (var i = 0; i < Object.keys(this.registeredLayouts).length; i++) {
      var data = {};
      data.controllerName = Object.keys(this.registeredLayouts)[i];
      data.controller = this.registeredLayouts[Object.keys(this.registeredLayouts)[i]];
      data.deviceLayout = this.getBestLayout(data.controller, this.currentDevice);
      
      data.controller.setLayout(data.controller.plasmaLayouts[data.deviceLayout]);
      
      
      console.log('Check Anim');

      
      //
      // TODO: Prüfen, wann was ausgeführt wird
      //
      if (data.controller.getLayoutOptions().animPos != undefined) {
        if (data.controller.getLayoutOptions().animPos[0] != undefined) {
          //console.log('animPos bei Navigation gefunden!' + i);
          data.controller.setLayoutOptions({animationPhase: 'FROM'});
          data.controller.resetFlowState();
          setTimeout(function () {
             this.controller.setLayoutOptions({animationPhase: 'TO'});
             //this.controller.getLayoutOptions().referenceDIVs = undefined;
          }.bind(data), 100);
        }
      }
      /*
      if (data.controller.plasmaLayouts[data.deviceLayout].from != undefined) {
        //console.log('from gefunden!');
        if (data.controller.getLayoutOptions().referenceDIVs != undefined) {
        //if (this.store.animPos[0].animClass == 'startTileBack0') {
          //console.log('referenceDIVs gefunden!' + i);
          data.controller.setLayout(data.controller.plasmaLayouts[data.deviceLayout].from);
          data.controller.resetFlowState();
          setTimeout(function () {
             this.controller.setLayout(this.controller.plasmaLayouts[this.deviceLayout].to);
             this.controller.getLayoutOptions().referenceDIVs = undefined;
          }.bind(data), 20);
        }
        else {
          data.controller.setLayout(data.controller.plasmaLayouts[data.deviceLayout].to);
        }
      }
      else {
        data.controller.setLayout(data.controller.plasmaLayouts[data.deviceLayout].to);
      }
      */
      
      if (data.controller.plasmaLayoutOptions[data.deviceLayout] != undefined) {
        data.controller.setLayoutOptions(data.controller.plasmaLayoutOptions[data.deviceLayout]);
      }
    }
  },
  updateStatesInLayoutOptions: function(store) {
    //console.log('update states');
    //console.log(store);
    
    // Copy state to layout options, including animation state (depending on state/URL)
    // cycle through registered components
    for (var i = 0; i < Object.keys(this.registeredLayouts).length; i++) {
      var data = {};
      data.controller = this.registeredLayouts[Object.keys(this.registeredLayouts)[i]];
      // set animation option for current main navigation
      //if (Object.keys(this.registeredLayouts)[i] == this.store.mainNav) {
      if (data.controller.mainNav == this.store.mainNav) {  
        // check if animation should be triggered
        var backHistoryStore1 = (this.history[this.history.length-1]);
        //var backHistoryStore2 = (this.history[this.history.length-2]);
        //var backHistoryCompare = (JSON.stringify(store) == JSON.stringify(backHistoryStore2));
        // compare target url with pre-last history entry
        //if (backHistoryCompare == true) {
        if (plasma.backButtonClicked == true) {  
          //console.log('back button pressed');
          if(backHistoryStore1.animPos && typeof backHistoryStore1.animPos[0] != 'undefined') {
              console.log('animate back');
              data.controllerFROM = this.registeredLayouts[backHistoryStore1.mainNav];
              // set layout options
              data.controller.setLayoutOptions(store);
              data.controllerFROM.setLayoutOptions(backHistoryStore1);
              // animate back
              data.controllerFROM.setLayoutOptions({animationPhase: 'FROM', animationRuns: 'TRUE'}); // 'block' setting to 'HIDE' in else branch below
              //data.controllerFROM.resetFlowState();
              setTimeout(function () {
                 this.controllerFROM.setLayoutOptions({animationPhase: 'HIDE', animationRuns: 'FALSE'}); // reset 'block'
                 this.controllerFROM.resetFlowState();
              }.bind(data), 200);
              setTimeout(function () {
                 this.controller.setLayoutOptions({animationPhase: 'TO'});
                 //this.controller.resetFlowState();
              }.bind(data), 20);
          }
          else {
            data.controller.setLayoutOptions({animationPhase: 'TO'});
          }
        }
        else {
          console.log('normal nav / no back button pressed');
          // set layout options
          data.controller.setLayoutOptions(store);
          if(data.controller.getLayoutOptions().animPos && typeof data.controller.getLayoutOptions().animPos[0] != 'undefined') {
              
              data.controller.setLayoutOptions({animationPhase: 'FROM'});
              data.controller.resetFlowState();
              setTimeout(function () {
                 this.controller.setLayoutOptions({animationPhase: 'TO'});
                 //this.controller.getLayoutOptions().referenceDIVs = undefined;
              }.bind(data), 50);
          }
          else {
            data.controller.setLayoutOptions({animationPhase: 'TO'})
          }
        }
      }
      else {
        // Hide with delay - look better and gives the layout the time to get the position of the DIV to animate from - before it goes away
        // First: Check if this is a controller which is blocked by 'animated back' (back button, see abover)
        if (data.controller.getLayoutOptions().animationRuns != 'TRUE') {
          setTimeout(function () {
               this.controller.setLayoutOptions({animationPhase: 'HIDE'})
            }.bind(data), 20);
        }
      }
    }
  },
  calcGridPosSize: function(input) {
    // Example input: {x:0, y:0, width:6, height:1, screensize:[1000,800]}
    // get x-position (px) for frag-th column (frag raging form (0/grid) to (grid/grid) )
    // - considering margins and gutters!

    var config = plasma.globalLayout[plasma.currentDevice];
    var colWidth = (input.screensize[0]-config.margins[1]-config.margins[3]-(config.columns-1)*config.colGutter)/config.columns;
    var colHeight = (input.screensize[1]-config.margins[0]-config.margins[2]-(config.columns-1)*config.colGutter)/config.columns;
    var posX = config.margins[3]+input.x*(colWidth+config.colGutter);
    var posY = config.margins[0]+input.y*(colHeight+config.colGutter);
    //var posY = config.margins[0]+(input.screensize[1]-config.margins[0]-config.margins[2])*input.y;
    var sizeX = input.width*(colWidth+config.colGutter)-config.colGutter;
    var sizeY = input.height*(colHeight+config.colGutter)-config.colGutter;
    //var sizeY = (input.screensize[1]-config.margins[0]-config.margins[2])*input.height;

    return {pos: [posX,posY,0], size:[sizeX,sizeY]}
  },
  flexFont : function () {
    // Helper for dynamic font scaling - dependent on containers width
    var divs = document.getElementsByClassName("flexFont");
    for(var i = 0; i < divs.length; i++) {
      var relFontsize = divs[i].offsetWidth*0.05;
      relFontsize = Math.round(relFontsize/2)*2;
      if (relFontsize<12) relFontsize=12;
      divs[i].style.fontSize = relFontsize+'px';
      console.log(relFontsize);
    }
  },
  debounce: function (func, wait, immediate) {
    // HELPER: DEBOUNCE
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If 'immediate' is passed, trigger the function on the
    // leading edge, instead of the trailing.
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    }
  },
  plasmaIcons: {
    boxBarClosed: '<svg fill="#FFFFFF" viewBox="0 0 24 24" width="100%"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
    boxBarOpened: '<svg fill="#FFFFFF" viewBox="0 0 24 24" width="100%">< fill="#FFFFFF" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
    dotsVertical: '<svg fill="#FFFFFF" viewBox="0 0 24 24" width="100%"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
    rocket: '<svg version="1.1" id="Layer_1" x="0px" y="0px"	 width="100%" viewBox="0 0 22.677 22.677" enable-background="new 0 0 22.677 22.677" xml:space="preserve"><g>	<path fill="#FFFFFF" d="M20.39,2.778c-0.063-0.064-0.154-0.094-0.242-0.084c-0.318,0.041-3.131,0.422-3.956,1.248l-7.366,7.367		l3.033,3.033c2.262-2.262,6.604-6.605,7.367-7.366c0.826-0.826,1.207-3.638,1.248-3.956C20.483,2.932,20.453,2.841,20.39,2.778z"/>	<path fill="#FFFFFF" d="M11.446,14.754l-3.033-3.033L7.454,12.68c-0.114,0.114-0.114,0.298,0,0.412l2.621,2.622		c0.055,0.054,0.128,0.085,0.206,0.085s0.151-0.031,0.207-0.085C10.488,15.713,10.857,15.343,11.446,14.754z"/>	<path fill="#FFFFFF" d="M15.053,12.034c-0.109-0.045-0.234-0.02-0.317,0.063l-3.495,3.496c-0.044,0.044-0.073,0.102-0.083,0.165		l-0.583,4.077c-0.017,0.122,0.044,0.242,0.154,0.299c0.042,0.022,0.088,0.033,0.135,0.033c0.072,0,0.143-0.027,0.198-0.078		c0.016-0.015,1.625-1.509,2.64-2.524c0.343-0.344,0.914-1.091,1.109-1.672c0.285-0.859,0.421-3.13,0.421-3.59		C15.232,12.186,15.161,12.079,15.053,12.034z"/>	<path fill="#FFFFFF" d="M7.575,11.927l3.494-3.496c0.084-0.083,0.108-0.208,0.063-0.317c-0.045-0.109-0.151-0.18-0.269-0.18		c-0.41,0-2.74,0.109-3.612,0.4c-0.573,0.191-1.3,0.781-1.65,1.13c-1.016,1.016-2.509,2.624-2.524,2.64		c-0.084,0.09-0.101,0.224-0.044,0.333c0.051,0.097,0.151,0.156,0.258,0.156c0.014,0,0.027-0.001,0.042-0.003l4.077-0.583		C7.472,12,7.53,11.972,7.575,11.927z"/>	<path fill="#FFFFFF" d="M7.925,14.202c-0.579-0.579-1.5-0.469-2.229,0.26c-0.744,0.744-1.961,4.332-2.098,4.739		c-0.035,0.104-0.008,0.22,0.07,0.299c0.055,0.055,0.129,0.085,0.206,0.085c0.031,0,0.062-0.004,0.093-0.016		c0.407-0.136,3.994-1.354,4.738-2.098c0.745-0.745,0.849-1.642,0.26-2.23L7.925,14.202z"/></g></svg>',
    plane: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="100%" viewBox="0 0 22.677 22.677" enable-background="new 0 0 22.677 22.677" xml:space="preserve"><g>	<path fill="#FFFFFF" d="M2.18,10.827C2.071,10.872,2,10.979,2,11.097c0,0.119,0.072,0.225,0.182,0.269l6.095,2.46l10.706-9.924		L2.18,10.827z"/>	<path fill="#FFFFFF" d="M8.488,14.425v5.117c0,0.131,0.087,0.246,0.214,0.281c0.025,0.007,0.051,0.01,0.078,0.01		c0.1,0,0.196-0.052,0.25-0.141l2.506-4.173l4.577,2.446C16.155,17.988,16.203,18,16.251,18c0.041,0,0.082-0.009,0.121-0.027		c0.083-0.038,0.143-0.113,0.163-0.202l3.017-13.599L8.488,14.425z"/></g></svg>',
    location: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="100%"  viewBox="0 0 22.677 22.677" enable-background="new 0 0 22.677 22.677" xml:space="preserve"><path fill="#000000" d="M11.338,2.322c-3.48,0-6.312,2.832-6.312,6.312c0,3.38,5.822,11.265,6.07,11.599	c0.057,0.077,0.146,0.122,0.242,0.122c0.095,0,0.185-0.045,0.241-0.122c0.249-0.334,6.07-8.219,6.07-11.599	C17.649,5.154,14.818,2.322,11.338,2.322z M11.338,11.338c-1.492,0-2.705-1.213-2.705-2.705c0-1.492,1.213-2.705,2.705-2.705	c1.491,0,2.705,1.213,2.705,2.705C14.043,10.125,12.829,11.338,11.338,11.338z"/></svg>',
    people: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="100%"  viewBox="0 0 22.677 22.677" enable-background="new 0 0 22.677 22.677" xml:space="preserve"><path d="M11.338,4.589c-3.722,0-6.75,3.028-6.75,6.75c0,1.738,0.658,3.387,1.854,4.646v0h0c0,0,0,0.001,0,0.001l0,0	c0.001,0.001,0.002,0.002,0.002,0.003c0,0,0,0,0.001,0.001l0,0c0,0,0,0,0,0c0,0,0,0,0.001,0c0,0,0,0,0,0l0,0	c0,0,0,0.001,0.001,0.001c0,0,0,0.001,0,0.001l0,0c0.001,0,0.001,0.001,0.002,0.002l0,0c0,0,0.001,0.001,0.001,0.001	c1.296,1.31,3.123,2.091,4.885,2.091c1.766,0,3.592-0.782,4.885-2.092c0-0.001,0.001-0.003,0.002-0.004	c1.201-1.261,1.862-2.913,1.862-4.653C18.088,7.617,15.06,4.589,11.338,4.589z M16.022,15.547c-0.314-0.166-0.957-0.4-2.072-0.794	c-0.422-0.149-0.855-0.303-1.252-0.45v-1.122c0.268-0.156,0.795-0.596,0.847-1.67c0.097-0.049,0.179-0.131,0.239-0.241	c0.075-0.136,0.116-0.313,0.116-0.499c0-0.328-0.117-0.587-0.305-0.711c0.003-0.01,0.007-0.02,0.009-0.03	c0.136-0.421,0.387-1.206,0.222-1.867c-0.188-0.754-1.229-1.021-2.062-1.021c-0.758,0-1.687,0.221-1.991,0.829	C9.379,7.939,9.159,8.107,9.053,8.246c-0.347,0.458-0.104,1.322,0.026,1.786c0.002,0.008,0.005,0.016,0.007,0.024	c-0.19,0.123-0.31,0.383-0.31,0.715c0,0.356,0.139,0.631,0.355,0.74c0.052,1.074,0.579,1.514,0.847,1.669v1.122	c-0.367,0.134-0.76,0.263-1.142,0.388c-0.843,0.275-1.641,0.538-2.182,0.858c-1.042-1.158-1.616-2.646-1.616-4.21	c0-3.474,2.826-6.3,6.3-6.3c3.473,0,6.299,2.826,6.299,6.3C17.638,12.902,17.065,14.389,16.022,15.547z"/></svg>'
  }

};


// Resizing 
// For better readability added here at the end of code...
//
// Execution is "debounced" - which means:
// Maximum run of once per 200 milliseconds (see parameter in last line)
plasma.updateLayout = plasma.debounce(function(e) {
  plasma.identifyDevice();
  //console.log('device: ' + plasma.currentDevice);
}, 200);

plasma.resizeEnd = function(){
  // Haven't resized for 500ms!
  console.log('Engine: resize end. Current device: ' + plasma.currentDevice + '/ '+ plasma.deviceName +  ', Prev. device: ' + plasma.previousDevice);

  //console.log(plasma.registeredLayouts.navbar);
  if (plasma.currentDevice != plasma.previousDevice) {
    //console.log('layout change to: ' + plasma.currentDevice);
    plasma.updateLayouts();
    plasma.previousDevice = plasma.currentDevice;
  }
}

plasma.resizeEndTimeout = 0;

Engine.on('resize', function() {
  plasma.updateLayout();
  
  // Check for end of resize (via timeout)
  clearTimeout(plasma.resizeEndTimeout);
  plasma.resizeEndTimeout = setTimeout(plasma.resizeEnd, 200);
});


//
//
// REDUX & ROUTER
//
//

plasma.store = initState;
plasma.initState = initState;
plasma.history = [];
plasma.linkClicked = true;
plasma.backButtonClicked = false;

// Now add methods: 
// Reducer, see https://k94n.com/gordux-js-the-redux-pattern-in-vanilla-js
plasma.appReducer = function (state, action) {
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
      case 'NAVIGATE':
        console.log('NAVIGATE!');
        //console.log(action.params);
        //this.history.push(state);
        returnState = Object.assign({}, state, action.params);
        return returnState
        break;  
      case 'GOTO':
        returnState.subNav = action.params.subNav;  
        return returnState;
        break;
      case 'INIT':
        console.log('INIT!');
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
plasma.router = function (event) {
  // detect back button click
  // works together with flag plasma.linkClicked which is always set in plasma.navigator()
  if (plasma.linkClicked != true) {
    //console.log('back button clicked!');
    plasma.backButtonClicked = true;
  }
  else {
    plasma.linkClicked = false;
    plasma.backButtonClicked = false;
  }
  // Current route url (getting rid of '#' in hash as well)
  // im empty # set default/initState
  var url = location.hash.slice(1) || encodeURIComponent(JSON.stringify(plasma.initState));
  var urlStore = {};
  var oldStore = {};
  console.log('HASH CHANGE!');
  var oldHash = event.oldURL || '';
  if (oldHash.indexOf('#') == -1 ) {
    // initial load, no referrer in URL
    //oldHash = encodeURIComponent(JSON.stringify(plasma.initState))
    oldHash = url
  }
  else {
    oldHash = oldHash.split("#").pop();
  }
  try {
        urlStore = JSON.parse(decodeURIComponent(url));
        oldStore = JSON.parse(decodeURIComponent(oldHash));
        // Store last URL in history
        plasma.history.push(oldStore);
        // check if navigating back (pressing browser back-buuton)
        var backHistoryStore = (plasma.history[plasma.history.length-2]);
        var backHistoryCompare = (JSON.stringify(urlStore) == JSON.stringify(backHistoryStore));
        // compare target url with pre-last history entry
        // only save last ...NavFrom if not navigating back (keep history URL untouched)
        if (backHistoryCompare == false) {

        }
        //document.dispatchEvent(new CustomEvent('action', { detail: { type: 'SET-STATE', params: urlStore }}))
        document.dispatchEvent(new CustomEvent('action', { detail: { type: 'NAVIGATE', params: urlStore }}))
      } catch (e) {
        //document.dispatchEvent(new CustomEvent('action', { detail: { type: 'INIT' }}));
  }
}


// navigates to a page
plasma.navigator = function (targetState) {
  var currentStore = Object.assign({}, this.store);

  if ((currentStore.mainNav != targetState.mainNav) || (currentStore.subNav != targetState.subNav) ){
    for (var i = 0; i < targetState.animPos.length; i++) {
      var backEl = document.querySelector('.'+targetState.animPos[i].animClass);
      var backEloldpos = backEl.getBoundingClientRect();
      targetState.animPos[i].animX = backEloldpos.left;
      targetState.animPos[i].animY = backEloldpos.top;
      targetState.animPos[i].animW = backEloldpos.width;
      targetState.animPos[i].animH = backEloldpos.height;
      targetState.animPos[i].device = this.currentDevice; // store current device to check later - in case of navigating back - if animation pos still valid
    }
    this.linkClicked = true;
    location.hash = encodeURIComponent(JSON.stringify(Object.assign({}, currentStore, targetState)));
  }
}


// Event listener for actions
document.addEventListener('action', function(e) {
    console.log('ACTION listener');
    //console.log(e);
    this.store = this.appReducer(this.store, e.detail);
    if ( location.hash.slice(1) == encodeURIComponent(JSON.stringify(this.store))) {
      
    }else {
      //console.log('HASH was updated');
      location.hash=encodeURIComponent(JSON.stringify(this.store));
    }
    document.dispatchEvent(new CustomEvent('state'));
}.bind(plasma), false);

// Event listener for router
// Listen on hash change (app already running):
window.addEventListener('hashchange', plasma.router);
// Listen on (initial) page load:
window.addEventListener('load', plasma.router);


module.exports = plasma;