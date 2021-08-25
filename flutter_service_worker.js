'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "6d5480677821951bfb0deb940ad1f6e8",
"assets/assets/fonts/Montserrat-Bold.ttf": "ade91f473255991f410f61857696434b",
"assets/assets/fonts/Montserrat-Medium.ttf": "c8b6e083af3f94009801989c3739425e",
"assets/assets/fonts/Montserrat-Regular.ttf": "ee6539921d713482b8ccd4d0d23961bb",
"assets/assets/fonts/NeueMontreal-Bold.otf": "821f26682638deba9a0945dc329a294a",
"assets/assets/fonts/NeueMontreal-Medium.otf": "9cc3c574097c0b01f15ef6ef6a4a2607",
"assets/assets/fonts/NeueMontreal-Regular.otf": "4d742e8ebdf9b030dc46a59963a6e1fb",
"assets/assets/images/sb_wav_alt.png": "3e264204366f924abb761a64cd1e6f3c",
"assets/FontManifest.json": "594051617245e9ab1bf92602a06632da",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "8afb53faa4fc6dced2d7316a8bda3b6e",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/android-icon-144x144.png": "68b5012b1c5c96f3b35037fd69087aaf",
"icons/android-icon-192x192.png": "09f50fddf07e29b3fff2e8a14e4f9b86",
"icons/android-icon-36x36.png": "846c994962732a2960facb95e6003294",
"icons/android-icon-48x48.png": "62507bfb479dfb7c4b93fa41bb9b6f83",
"icons/android-icon-72x72.png": "f89493c840eb8d0f0b77c051fa5dc0e1",
"icons/android-icon-96x96.png": "897bebaa88f7c0b508ef073f1734d501",
"icons/apple-icon-114x114.png": "bdb3805d129d85130b30d36591926b2e",
"icons/apple-icon-120x120.png": "42e993a1f39c850977716afd14b4fcd6",
"icons/apple-icon-144x144.png": "68b5012b1c5c96f3b35037fd69087aaf",
"icons/apple-icon-152x152.png": "8616007829675964b87df4c60ea90461",
"icons/apple-icon-180x180.png": "231250acc4fdfc2583348f261987065e",
"icons/apple-icon-57x57.png": "5d0b9c61a182548e8293b5efdc42c47a",
"icons/apple-icon-60x60.png": "d41518ee50bb3ce991d779e298682864",
"icons/apple-icon-72x72.png": "f89493c840eb8d0f0b77c051fa5dc0e1",
"icons/apple-icon-76x76.png": "2cbf162aba4c9f386390520cbb96d158",
"icons/apple-icon-precomposed.png": "a7e2e99237a5808a4deb05d669d0a172",
"icons/apple-icon.png": "a7e2e99237a5808a4deb05d669d0a172",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/favicon-16x16.png": "3e13577aac4cc6a19cac1d51669a74ff",
"icons/favicon-32x32.png": "5cbe8a48b0ba203bc7936f219d5f07f7",
"icons/favicon-96x96.png": "897bebaa88f7c0b508ef073f1734d501",
"icons/favicon.ico": "de363624db8baddcf229cf58384738d7",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/ms-icon-144x144.png": "68b5012b1c5c96f3b35037fd69087aaf",
"icons/ms-icon-150x150.png": "d68a5fa16f21cf33f1962833ea2460d5",
"icons/ms-icon-310x310.png": "6e6913934314877a8f230a2c4143bab5",
"icons/ms-icon-70x70.png": "23c648b56064ac18516c022acd059e7c",
"index.html": "2fc080878ea2d869d9359cd6e3bade12",
"/": "2fc080878ea2d869d9359cd6e3bade12",
"main.dart.js": "736ddcc62da4567f5d2b0cda32440f16",
"manifest.json": "5a2c0526f1fe73e6f211bc7a9d15c210",
"version.json": "426313f2f3133c2f20415344c4a22df3"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
