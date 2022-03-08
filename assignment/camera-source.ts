import { MediaProcessorConnectorInterface } from '@vonage/media-processor'
import VideoSink from './video-sink';

class CameraSource {
  stream_!: MediaStream;
  mediaProcessorConnector_!: MediaProcessorConnectorInterface
  sinks_: Array<VideoSink> = []
  videoTrack_!: MediaStreamTrack
  constructor() {
    this.init()
  }

  async init() {
    this.stream_ = await navigator.mediaDevices.getUserMedia({audio: false, video: { width: 1280, height: 720 }});
    this.videoTrack_ = this.stream_.getVideoTracks()[0]
  }

  setMediaProcessorConnector(mediaProcessorConnector: MediaProcessorConnectorInterface): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      this.mediaProcessorConnector_ = mediaProcessorConnector;
      if (!this.stream_) 
      {
        console.log('[CameraSource] Requesting camera.');
        reject("no stream")
      }
      this.mediaProcessorConnector_.setTrack(this.videoTrack_).then( newTrack => {
        let processedStream = new MediaStream();
        processedStream.addTrack(newTrack);
        let sink = new VideoSink()
        sink.setMediaStream(processedStream)
        this.sinks_.push(sink)
        resolve();
      })
      .catch(e => {
        reject(e)
      })
    });
  }
}

export default CameraSource;
