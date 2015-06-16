'use strict';

var assert = require('assert');
var LockScreen = require('./lib/lockscreen');
var StatusBar = require('./lib/statusbar');
var FakeApp = require('./lib/fakeapp');

marionette('LockScreen status bar', function() {
  var system;
  var lockScreen;
  var statusBar;
  var firstApp;
  var firstAppOrigin = 'fakeapp.gaiamobile.org';
  var apps = {};
  apps[firstAppOrigin] = __dirname + '/../apps/fakeapp';
  var client = marionette.client({
    profile: {
      settings: {
        'lockscreen.enabled': true
      },

      apps: apps
    },
    desiredCapabilities: { raisesAccessibilityExceptions: true }
  });

  setup(function() {
    system = client.loader.getAppClass('system');
    system.waitForFullyLoaded();
    lockScreen = (new LockScreen()).start(client);
    statusBar = new StatusBar(client);

    firstApp = new FakeApp(client, 'app://' + firstAppOrigin);
  });

  test('should show the maximised status bar only', function() {
    lockScreen.unlock();

    firstApp.launch();
    system.waitUntilScreenshotable(firstApp.iframe);

    lockScreen.lock();

    assert(statusBar.maximizedStatusbar.displayed());
    assert(!statusBar.minimizedStatusbar.displayed());
  });
});
