// BEGIN DAY 1.
var artistMap = {};
var artistId = '';

function setup() {
  var gallery = document.querySelector('content-gallery');

  gallery.addEventListener('thumbnail-tap', function(event) {
    artistId = event._args;
    gallery.setDrawerBackground(artistMap[artistId].thumbnail);
    gallery.openDrawer();
  });

  gallery.addEventListener('drawer-open', function() {
    var artistInfo = artistMap[artistId];

    var musicTitle = document.getElementById('artist-name');
    musicTitle.innerHTML = artistInfo.name;

    var musicDescription = document.getElementById('artist-description');
    musicDescription.innerHTML = artistInfo.description;

    var songTitle = document.getElementById('song');
    songTitle.innerHTML = artistInfo.sampletrack.trackname;

    var mainContent = document.getElementById('main-content');
    mainContent.style.opacity = 1;
  });

  gallery.addEventListener('drawer-close', function() {
    var mainContent = document.getElementById('main-content');
    mainContent.style.opacity = 0;

    var musicDescription = document.getElementById('artist-description');
    musicDescription.scrollTop = 0;
  });

  handleMusicPlayback();
  fetchMusicData();
}


// BEGIN DAY 2.
function handleMusicPlayback() {
  var sampleTrack = document.getElementById('sample-track');

  sampleTrack.addEventListener('tap', function() {
    var audioElement = document.getElementById('music-sample');
    audioElement.src = artistMap[artistId].sampletrack.url;

    var playElement = document.getElementById('play');
    var equalizerElement = document.getElementById('equalizer');
    playElement.style.opacity = 0;
    equalizerElement.style.opacity = 0;

    audioElement.addEventListener('canplay', function() {
      playElement.style.opacity = 0;
      equalizerElement.style.opacity = 1;      
    })

    audioElement.addEventListener('ended', function() {
      playElement.style.opacity = 1;
      equalizerElement.style.opacity = 0;
    })

    audioElement.play();
  });
}


function fetchMusicData() {
  $.getJSON('https://cardshark.firebaseio.com/artists.json', handleMusicData);
}

function handleMusicData(data) {
  var gallery = document.querySelector('content-gallery');
  // Hang on to our artists.
  artistMap = data;
  gallery.drawThumbnailsFromObject(data);
}

window.addEventListener('WebComponentsReady', function(e) {
  setup();
});