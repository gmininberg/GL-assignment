class CanvasTransformer implements Transformer { 
  resizeCanvas_!: OffscreenCanvas
  resizeCtx_!: OffscreenCanvasRenderingContext2D | null
  constructor() {
  }

  async start(controller:TransformStreamDefaultController) {
    this.resizeCanvas_ = new OffscreenCanvas(160, 120)
    this.resizeCtx_ = this.resizeCanvas_.getContext('2d', {alpha: false, desynchronized: true})
  }

  transform(frame:any, controller:TransformStreamDefaultController) {
    let timestamp: number = frame.timestamp
    this.resizeCtx_?.drawImage(frame,
      0,
      0,
      frame.displayWidth,
      frame.displayHeight,
      0,
      0,
      160,
      120)
      frame.close()
    controller.enqueue(new VideoFrame(this.resizeCanvas_, {timestamp, alpha: 'discard'}));
  }

  flush(controller:TransformStreamDefaultController) {
  }
}

export default CanvasTransformer;