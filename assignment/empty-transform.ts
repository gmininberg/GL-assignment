import { WasmInfo, WasmLoader } from "./wasmLoader";

class TestTransformer implements Transformer { 
  resizeCanvas_!: OffscreenCanvas
  resizeCtx_!: OffscreenCanvasRenderingContext2D | null
  wamInfo_!: WasmInfo
  constructor() {
  }

  async start(controller:TransformStreamDefaultController) {
    this.resizeCanvas_ = new OffscreenCanvas(160, 120)
    this.resizeCtx_ = this.resizeCanvas_.getContext('2d', {alpha: false, desynchronized: true})

    await WasmLoader(location.href).then( wamInfo => {
      if(wamInfo){
        this.wamInfo_ = wamInfo;
      }
    })
    .catch(e => {
      console.log("error useTFLite:", e);
    });

  }

  transform(frame:any, controller:TransformStreamDefaultController) {
    // controller.enqueue(frame)
    // return
    
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
    console.log('empty transformer flush');
  }
}

export default TestTransformer;