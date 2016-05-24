var webpack = require('webpack');
var fs = require('fs');
var p = require('path');
var minimatch = require('minimatch');
var crypto  = require('crypto');

function AppcachePlugin(options) {
  
  this.options = {};
  this.options.directory = options.directory || './';
  this.options.filter = options.filter || [];  // example: ['foo.css', '*.md']
  this.options.filename = options.filename || 'manifest.appcache';
  this.options.version = options.version || '0.0';

}



AppcachePlugin.prototype.apply = function(compiler) {
  var self = this;
  
  compiler.plugin('emit', function(compilation, callback) {
    
    // Recursive directory lister based on https://github.com/jergason/recursive-readdir
    function patternMatcher(pattern) {
      return function(path, stats) {
        var minimatcher = new minimatch.Minimatch(pattern, {matchBase: true})
        return (!minimatcher.negate || stats.isFile()) && minimatcher.match(path)
      }
    }
    
    function toMatcherFunction(ignoreEntry) {
      if (typeof ignoreEntry == 'function') {
        return ignoreEntry
      } else {
        return patternMatcher(ignoreEntry)
      }
    }
    
    function readdir(path, ignores, callback) {
      if (typeof ignores == 'function') {
        callback = ignores
        ignores = []
      }
      ignores = ignores.map(toMatcherFunction)
    
      var list = []
    
      fs.readdir(path, function(err, files) {
        if (err) {
          return callback(err)
        }
    
        var pending = files.length
        if (!pending) {
          // we are done, woop woop
          return callback(null, list)
        }
    
        files.forEach(function(file) {
          var filePath = p.join(path, file)
          fs.stat(filePath, function(_err, stats) {
            if (_err) {
              return callback(_err)
            }
    
            if (ignores.some(function(matcher) { return matcher(filePath, stats) })) {
              pending -= 1
              if (!pending) {
                return callback(null, list)
              }
              return null
            }
    
            if (stats.isDirectory()) {
              readdir(filePath, ignores, function(__err, res) {
                if (__err) {
                  return callback(__err)
                }
    
                list = list.concat(res)
                pending -= 1
                if (!pending) {
                  return callback(null, list)
                }
              })
            } else {
              list.push(filePath)
              pending -= 1
              if (!pending) {
                return callback(null, list)
              }
            }
    
          })
        })
      })
    }
    
    
    readdir(self.options.directory, self.options.filter, function (err, files) {
      
      var hasher = crypto.createHash('sha256');
     
      var filelist = '';
  
      // load app-config from disk
      var configData = JSON.parse(fs.readFileSync(__dirname + '/../app-config.json', 'utf8'));
      if (configData["Offline-Support"]["Application Cache"] =='on') {
        // Loop through all files (array)
        // adding a new line item for each filename.
        for (var i = 0; i < files.length; ++i) {
            var file = files[i].substring(files[i].indexOf('/')+1);
            filelist += (''+file +'\n');
            var fileData = fs.readFileSync('./'+files[i]);
            hasher.update(fileData);
        }
      }
      
      var manifest = 'CACHE MANIFEST\n';
      manifest += ('# Version: '+self.options.version+'\n');
      manifest += ('# hash: ' + hasher.digest("hex") +'\n\n')
      manifest += ('CACHE:\n');
      //manifest += ('/\n');
      manifest += filelist;
      manifest += ('\nNETWORK:\n*\n\n');
      manifest += ('FALLBACK:\n/ /');
      
      
      
      
      // Insert this list into the Webpack build as a new file asset:
      compilation.assets[self.options.filename] = {
        source: function() {
          return manifest;
        },
        size: function() {
          return manifest.length;
        }
      };
  
      callback();
      
    });
    
    
  });
};

module.exports = AppcachePlugin;