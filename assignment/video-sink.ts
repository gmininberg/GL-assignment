
class VideoSink {
  video_!: HTMLVideoElement
  constructor() {
  }
  
  async setMediaStream(stream: any) {
    console.log('[VideoSink] Setting sink stream.', stream);
    if (!this.video_) {
      this.video_ = document.createElement('video');
      this.video_.classList.add('video', 'sinkVideo');
      document.getElementById('outputVideoContainer')!.appendChild(this.video_);
      console.log('[VideoSink] Added video element to page.', this.video_);
    }
    this.video_.srcObject = stream;
    this.video_.play();
  }
}

export default VideoSink;
