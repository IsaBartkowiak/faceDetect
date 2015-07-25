var mood = '';
(function() {

var api_key = '966c9316991e4c7db8528eeac4666db9';
var api_secret = '3f534b9382794d8bab213006e4a21bae';

  function drawFacesAddPoint(control, imgWidth, imgHeight, point, title) {
    var x = Math.round(point.x * imgWidth / 100);
    var y = Math.round(point.y * imgHeight / 100);
    var pointClass = title == null ? "api_face_all_point" : "api_face_point";
    var pointStyle = 'top: ' + y + 'px; left: ' + x + 'px;';
    var pointTitle = (title == null ? '' : title + ': ') + 'X=' + x + ', Y=' + y + ', Confidence=' + point.confidence + '%' + (title == null ? ', Id=' + point.id.toString(16) : '');
    control.append($('<span class="' + pointClass + '" style="' + pointStyle + '" title="' + pointTitle + '"></span>'));
  }
  function drawFaces(div, photo, drawPoints) {
    if (!photo) {
      alert("No image found");
      return;
    }
    if (photo.error_message) {
      alert(photo.error_message);
      return;
    }
    var imageWrapper = $('<div class="image_wrapper"></div>').appendTo(div);
    var maxImgWidth = parseInt(div.prev().children(".img_max_width").html(), 10);
    var maxImgHeight = parseInt(div.prev().children(".img_max_height").html(), 10);
    var imgWidth = photo.width;
    var imgHeight = photo.height;
    var scaleFactor = Math.min(maxImgWidth / imgWidth, maxImgHeight / imgHeight);
    if (scaleFactor < 1) {
      imgWidth = Math.round(imgWidth * scaleFactor);
      imgHeight = Math.round(imgHeight * scaleFactor);
    }
    imageWrapper.append($('<img alt="face detection results" width="' + imgWidth + 'px" height="' + imgHeight + 'px" src="' + photo.url + '" />'));
    if (photo.tags) {
      for (var i = 0; i < photo.tags.length; ++i) {
        var tag = photo.tags[i];
        var tagWidth = tag.width * 1.5;
        var tagHeight = tag.height * 1.5;
        var width = Math.round(tagWidth * imgWidth / 100);
        var height = Math.round(tagHeight * imgHeight / 100);
        var left = Math.round((tag.center.x - 0.5 * tagWidth) * imgWidth / 100);
        var top = Math.round((tag.center.y - 0.5 * tagHeight) * imgHeight / 100);
        if (drawPoints && tag.points) {
          for (var p = 0; p < tag.points.length; p++) {
            drawFacesAddPoint(imageWrapper, imgWidth, imgHeight, tag.points[p], null);
          }
        }
        var tagStyle = 'top: ' + top + 'px; left: ' + left + 'px; width: ' + width + 'px; height: ' + height + 'px; transform: rotate(' +
          tag.roll + 'deg); -ms-transform: rotate(' + tag.roll + 'deg); -moz-transform: rotate(' + tag.roll + 'deg); -webkit-transform: rotate(' +
          tag.roll + 'deg); -o-transform: rotate(' + tag.roll + 'deg)';
var apiFaceTag = $('<div class="api_face" style="' + tagStyle + '"><div class="api_face_inner"><div class="api_face_inner_tid" name="' + tag.tid + '"></div></div></div>').appendTo(imageWrapper);
if (drawPoints) {
  if (tag.eye_left) drawFacesAddPoint(imageWrapper, imgWidth, imgHeight, tag.eye_left, "Left eye");
  if (tag.eye_right) drawFacesAddPoint(imageWrapper, imgWidth, imgHeight, tag.eye_right, "Right eye");
  if (tag.mouth_center) drawFacesAddPoint(imageWrapper, imgWidth, imgHeight, tag.mouth_center, "Mouth center");
  if (tag.nose) drawFacesAddPoint(imageWrapper, imgWidth, imgHeight, tag.nose, "Nose tip");
}
}
}
}
function callback(data) {
  var result = JSON.parse(data);
  drawFaces($("#conent_demo_image"), result.photos, true);
  $('.emotion').text('emotion: '+result.photos[0].tags[0].attributes.mood.value);
  $('.genre').text('genre: '+result.photos[0].tags[0].attributes.gender.value);
  $('.age').text('Age estimé: '+result.photos[0].tags[0].attributes.age_est.value);
  mood = result.photos[0].tags[0].attributes.mood.value;
  deezer(mood);

}

function init(data) {
  var files = [];
  files['test'] = data;
  client = new FCClientJS('966c9316991e4c7db8528eeac4666db9', '3f534b9382794d8bab213006e4a21bae');
  var options = new Object();
  options.detect_all_feature_points = true;
  options.attributes = 'all';
  client.facesDetect(null, files, options, callback);
}












var streaming = false,
video        = document.getElementById('video'),
cover        = document.getElementById('cover'),
canvas       = document.getElementById('canvas'),
photo        = document.getElementById('photo'),
startbutton  = document.getElementById('startbutton'),
width = 320,
height = 0;

navigator.getMedia = ( navigator.getUserMedia ||
 navigator.webkitGetUserMedia ||
 navigator.mozGetUserMedia ||
 navigator.msGetUserMedia);

navigator.getMedia(
{
  video: true,
  audio: false
},
function(stream) {
  if (navigator.mozGetUserMedia) {
    video.mozSrcObject = stream;
  } else {
    var vendorURL = window.URL || window.webkitURL;
    video.src = vendorURL.createObjectURL(stream);
  }
  video.play();
},
function(err) {
  console.log("An error occured! " + err);
}
);

video.addEventListener('canplay', function(ev){
  if (!streaming) {
    height = video.videoHeight / (video.videoWidth/width);
    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    streaming = true;
  }
}, false);

function convertDataURIToBinary(dataURI) {
   // serialize the base64/URLEncoded data
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataURI.split(',')[1]);
        }
        else {
            byteString = unescape(dataURI.split(',')[1]);
        }

        // parse the mime type
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // construct a Blob of the image data
        var array = [];
        for(var i = 0; i < byteString.length; i++) {
            array.push(byteString.charCodeAt(i));
        }
        return new Blob(
            [new Uint8Array(array)],
            {type: mimeString}
        );
}


function getPic() {
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(video, 0, 0, width, height);
  var image = new Image();
  image = canvas.toDataURL('image/png');
  console.log(convertDataURIToBinary(image));
  return convertDataURIToBinary(image);
}

function displayPic(data){
  photo.setAttribute('src', data);
}

startbutton.addEventListener('click', function(ev){
  data = getPic();
  displayPic(data);
  init(data);
  ev.preventDefault();
}, false);

})();

