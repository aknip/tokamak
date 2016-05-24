const fs = require("fs");

module.exports = function (plop) {
    
    // load app-config from disk
    var configData = JSON.parse(fs.readFileSync(__dirname + '/app-config.json', 'utf8'));

    plop.setGenerator('setup', {
        description: 'this is a test',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'What is your name?',
            validate: function (value) {
                if ((/.+/).test(value)) { return true; }
                return 'name is required';
            }
        }],
        actions: [{
            type: 'add',
            path: 'build-tools/test-output/{{dashCase name}}.txt',
            templateFile: 'build-tools/templates/temp.txt'
        },
        {
            type: 'modify',
            path: 'build-tools/test-output/{{dashCase name}}.txt',
            pattern: /(-- APPEND ITEMS HERE --)/gi,
            template: '$1\r\nitem 1'
        }
        ]
    });
    
    plop.setGenerator('Change Loading Spinner', {
        description: 'Activates or deactivates AppCache and/or Service Worker',
        prompts: [{
				type: 'checkbox',
				name: 'loadingSpinnerOnOff',
				message: 'Chose offline support (SPACE to switch on/off)',
				choices: [
					{name: 'Application Cache', value: 'appcache', checked: true},
					{name: 'Service Woker', value: 'serviceworker'}
				]
			}],
        actions: function(data) {
            // APPCACHE OFF
            var code = '<html>';
            configData["Offline-Support"]["Application Cache"] ="off";
            // APPCACHE ON
			if(data.manifestOnOff.indexOf('appcache') > -1) {
				code = '<html manifest="manifest.appcache">';
				configData["Offline-Support"]["Application Cache"] ="on";
			}
			// write app-config to disk
			fs.writeFileSync(__dirname + '/app-config.json', JSON.stringify(configData, null, 2)); 
			return [{
                type: 'modify',
                path: 'build/index.html',
                pattern: /(<!--start loadingSpinner.*?>)([^]*)(<!--end loadingSpinner.*?>)/gim,
                template: '$1\r\n'+ code +'\r\n<!--end offline : plop -->'
            }];
            
            
		}
        
    });
    
    plop.setGenerator('Change Offline Support', {
        description: 'Activates or deactivates AppCache and/or Service Worker',
        prompts: [{
				type: 'checkbox',
				name: 'manifestOnOff',
				message: 'Chose offline support (SPACE to switch on/off)',
				choices: [
					{name: 'Application Cache', value: 'appcache', checked: true},
					{name: 'Service Woker', value: 'serviceworker'}
				]
			}],
        actions: function(data) {
            // APPCACHE OFF
            var code = '<html>';
            configData["Offline-Support"]["Application Cache"] ="off";
            // APPCACHE ON
			if(data.manifestOnOff.indexOf('appcache') > -1) {
				code = '<html manifest="manifest.appcache">';
				configData["Offline-Support"]["Application Cache"] ="on";
			}
			// write app-config to disk
			fs.writeFileSync(__dirname + '/app-config.json', JSON.stringify(configData, null, 2)); 
			return [{
                type: 'modify',
                path: 'build/index.html',
                pattern: /(<!--start offline.*?>)([^]*)(<!--end offline.*?>)/gim,
                template: '$1\r\n'+ code +'\r\n<!--end offline : plop -->'
            }];
            
            
		}
        
    });
};
