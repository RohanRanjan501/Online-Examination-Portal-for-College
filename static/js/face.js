console.log("attatched")
const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./static/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./static/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./static/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./static/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  // document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  let count = 0;

  function reset(){
    count = 0;
  }

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    
    let numOfFaces = resizedDetections.length
    console.log(numOfFaces)
    if(numOfFaces>1){
      // console.log("too many people")
      // nothing()
      count++;
      console.log("count "+count)
      document.getElementById('warning').innerHTML = `<div id="warning" class="alert alert-warning alert-dismissible fade show" role="alert">
            <center><strong>WARNING</strong> Multiple faces detected. Test will get automatically submitted in ${45-count} seconds.</center>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>`
      if(count==45){
        // console.log("too many")
        end()
      }
    }
    else if(numOfFaces==0){
      count++;
      console.log("count "+count)
      document.getElementById('warning').innerHTML = `<div id="warning" class="alert alert-warning alert-dismissible fade show" role="alert">
            <center><strong>WARNING</strong> No face detected. Test will get automatically submitted in ${45-count} seconds.</center>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>`
      if(count==45){
        // console.log("too many")
        end()
      }
    }
    else {
      count = 0;
      document.getElementById('warning').innerHTML = ''
    }
      
  }, 1000)
})
