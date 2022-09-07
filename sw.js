var cacheName = 'PixelDefense v0.4';
var filesToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/phaser.min.js',
  '/sw.js',
  '/manifest.js',


  '/scenes/preload.js',
  '/scenes/startGame.js',
  '/scenes/inventory.js',
  '/scenes/UI.js',

  '/assets/fonts/topaz.png',
  '/assets/fonts/topaz.xml',

  '/classes/actor.js',
  '/classes/auto.js',
  '/classes/breakables.js',
  '/classes/doors.js',
  '/classes/dpad.js',
  '/classes/enemies.js',
  '/classes/fov.js',
  '/classes/health.js',
  '/classes/objects.js',
  '/classes/player.js',
  '/classes/settings.js',

  '/classes/dungeon/dungeon.js',
  '/classes/dungeon/path.js',
  '/classes/dungeon/room.js',

  '/assets/particles.png',
  '/assets/particle.png',
  '/assets/sprites/blank.png',
  '/assets/sprites/inventory_bg.png',
  '/assets/sprites/inventory_item_selected.png',
  '/assets/sprites/inventory_item.png',
  '/assets/sprites/particles.png',
  '/assets/sprites/player_ui.png',
  '/assets/sprites/tiles_mini.png',
  '/assets/sprites/tileset16x16_auto.png',
  '/assets/sprites/rover.png',
  '/assets/sprites/spritesheets/a-enemies.png',
  '/assets/sprites/spritesheets/hero/a-hero1.png',
  //'/assets/sprites/spritesheets/hero/a-hero2.png',
  '/assets/sprites/controls/button_icons.png',
  '/assets/sprites/controls/dpad.png',

  //'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.10.1/dist/phaser.min.js'
];
self.addEventListener('install', function (event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function (err) {
      console.log(err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('sw activate');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('sw removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});