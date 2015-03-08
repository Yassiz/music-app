var ContentGalleryPrototype = Object.create(HTMLElement.prototype);
ContentGalleryPrototype.createdCallback = function() {
  this.isDrawerOpen = false;
  this.style.visibility = 'hidden';

  var userContent = this.innerHTML;
  this.innerHTML = '';
  this.thumbnailPanel = document.createElement('div');
  this.thumbnailPanel.id = 'thumbnail-panel';
  this.thumbnailPanel.className = 'scrollable';

  this.drawerPanel = document.createElement('div');
  this.drawerPanel.id = 'drawer-panel';
  this.drawerPanel.addEventListener('webkitTransitionEnd', function(e) {
    if (e.propertyName.indexOf('transform') < 0) return;
    this.isDrawerOpen ?
        $(this).trigger('drawer-open') : $(this).trigger('drawer-close');
  }.bind(this));

  $(this.drawerPanel).on('touchstart', function(e) {
    this.prevX = e.touches[0].clientX;
  }.bind(this));

  $(this.drawerPanel).on('touchmove', function(e) {
    var dx = this.prevX - e.touches[0].clientX;
    if (dx < -75) {
      this.closeDrawer();
    }
  }.bind(this))

  this.drawerMask = document.createElement('div');
  this.drawerMask.id = 'drawer-mask';
  this.drawerMask.innerHTML = userContent;

  this.appendChild(this.thumbnailPanel);
  this.drawerPanel.appendChild(this.drawerMask);
  this.appendChild(this.drawerPanel);

  this.style.visibility = 'visible';
};

ContentGalleryPrototype.attributeChangedCallback = function(attributeName) {
  if (attributeName == 'thumbnails') {
  	this.drawThumbnails();
  }
};

ContentGalleryPrototype.openDrawer = function() {
  this.isDrawerOpen = true;
  document.body.style.overflow = 'hidden';
  this.thumbnailPanel.style.webkitTransform = 'translate3d(-25%,0,0)'; 
  this.drawerPanel.style.webkitTransform = 'translate3d(0,0,0)';
};

ContentGalleryPrototype.closeDrawer = function() {
  this.isDrawerOpen = false;
  document.body.style.overflow = '';
  this.thumbnailPanel.style.webkitTransform = 'translate3d(0,0,0)'; 
  this.drawerPanel.style.webkitTransform = 'translate3d(100%,0,0)';
};

// Thumbnails is an object containing records (also objects). Each
// record is expected to have a thumbnail property containing a image URL.
// Example structure:
// { record1: {thumbnail: someImage.png},
//   record2: {thumbnail: anotherImage.png}
// }
ContentGalleryPrototype.drawThumbnailsFromObject = function(thumbnails) {
  this.thumbnailPanel.innerHTML = '';

  for (item in thumbnails) {    
    var newThumbnail = document.createElement('div');

    newThumbnail.addEventListener('tap', function(e) {
      $(this).trigger('thumbnail-tap', e.target.id);
    }.bind(this));

    newThumbnail.id = item;
    newThumbnail.className = 'thumbnail';
    newThumbnail.style.backgroundImage = 'url(' + thumbnails[item].thumbnail + ')';
    this.thumbnailPanel.appendChild(newThumbnail); 
  }
};

// Example structure: [{id: 'record1', thumbnail: 'someImage.png'}]
ContentGalleryPrototype.drawThumbnailsFromArray = function(thumbnails) {
  this.thumbnailPanel.innerHTML = '';

  thumbnails.forEach(function(item) {
  var newThumbnail = document.createElement('div');
    newThumbnail.addEventListener('tap', function(e) {
      $(this).trigger('thumbnail-tap', e.target.id);
    }.bind(this));

    newThumbnail.id = item.id;
    newThumbnail.className = 'thumbnail';
    newThumbnail.style.backgroundImage = 'url(' + item.thumbnail + ')';
    this.thumbnailPanel.appendChild(newThumbnail);
  }.bind(this));
};

ContentGalleryPrototype.setDrawerBackground = function(src) {
  this.drawerPanel.style.backgroundImage = 'url(' + src + ')';
};

var ContentGallery = document.registerElement('content-gallery', {
  prototype: ContentGalleryPrototype
});


// Do not remove. Corrects for a problem with overscroll on iOS.
var selScrollable=".scrollable";$(document).on("touchmove",function(o){o.preventDefault()}),$("body").on("touchstart",selScrollable,function(o){0===o.currentTarget.scrollTop?o.currentTarget.scrollTop=1:o.currentTarget.scrollHeight===o.currentTarget.scrollTop+o.currentTarget.offsetHeight&&(o.currentTarget.scrollTop-=1)}),$("body").on("touchmove",selScrollable,function(o){o.stopPropagation()});