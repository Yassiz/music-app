// BEGIN DAY 1.
//this needs to be accessed from the whole page
// sodefine it global

var gallery;
//Came from firebase
var artistMap;
var selectedArtistId;
var isPlaying = false;

function setup() {
  gallery = document.getElementById('myGallery');
  //listens for play and call handelPlay
  //myVideo.addEventListener('play', handelPlay);
  gallery.addEventListener('drawer-open',handleOpen);
  gallery.addEventListener('drawer-close',handleClose);
  gallery.addEventListener('thumbnail-tap',handleTap);

  var sampleTrack = document.getElementById('sample-track');
  // tap event comes from zepto which is faster than clicks on phone
  sampleTrack.addEventListener('tap',handlePlayback);

  drawThumbnails();
  /*document.addEventListener('tap',function() {
    gallery.openDrawer();
  });*/
}


function handlePlayback () {
  var song = artistMap[selectedArtistId].sampletrack.url;
  console.log(song);
  
  var myAudio = document.getElementById('music-sample');
  var playImage = document.getElementById('play');
  var equalImage = document.getElementById('equalizer');
  var loaderImage = document.getElementById('load');

  if (isPlaying) {
    myAudio.pause();
  } else {
    loaderImage.style.opacity = 1;
    myAudio.src = song;
    myAudio.play();
    playImage.style.opacity = 0;
  }

  myAudio.addEventListener('canplay', function() {
    isPlaying = true;
    loaderImage.style.opacity = 0;
    equalImage.style.opacity = 1;
  });

  myAudio.addEventListener('pause', function() {
    isPlaying = false;
    equalImage.style.opacity = 0;
    playImage.style.opacity = 1;
    console.log('tried pausing');
  });
}

function handleOpen() {
  //console.log('opened!!!');
  var artistName = document.getElementById('artist-name');
  artistName.innerHTML = artistMap[selectedArtistId].name;

  var artistDescription = document.getElementById('artist-description');
  artistDescription.innerHTML = artistMap[selectedArtistId].description;

 var artistSong = document.getElementById('song');
  artistSong.innerHTML =  artistMap[selectedArtistId].sampletrack.trackname;

  var mainContent = document.getElementById('main-content');
  mainContent.style.opacity = 1;
}

function handleClose() {
  var mainContent = document.getElementById('main-content');
  mainContent.style.opacity = 0;
}

function handleTap(e) {
  // console.log('they tapped!!!');
  selectedArtistId = e._args;
  console.log(e);
  gallery.setDrawerBackground(artistMap[selectedArtistId].thumbnail);
  gallery.openDrawer();
}

function drawThumbnails() {
  fetchData();
}

function fetchData () {
  $.getJSON('https://cardshark.firebaseio.com/artists.json', function(dagoods) {
    console.log(dagoods);
    artistMap = dagoods;
    gallery.drawThumbnailsFromObject(dagoods);
  });
}












window.addEventListener('WebComponentsReady', function(e) {
  setup();
});