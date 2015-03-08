// BEGIN DAY 1.
//this needs to be accessed from the whole page
// sodefine it global

var gallery;
//Came from firebase
var artistMap;
var selectedArtistId;
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
function handlePlayback() {
  var song = artistMap[selectedArtistId].sampletrack.url;
  var myAudio = document.getElementById('music-sample');
  myAudio.src = song;
  myAudio.play();
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