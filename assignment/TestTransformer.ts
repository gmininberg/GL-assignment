import { WasmInfo, WasmLoader } from "./wasmLoader";

class TestTransformer implements Transformer { 
  wamInfo_!: WasmInfo
  constructor() {
  }

  async start(controller:TransformStreamDefaultController) {
    await WasmLoader(location.href).then( wamInfo => {
      if(wamInfo){
        this.wamInfo_ = wamInfo;
      }
    })
    .catch(e => {
    });

  }

  transform(frame:VideoFrame, controller:TransformStreamDefaultController) {
    let buffer: ArrayBuffer = new ArrayBuffer(frame.allocationSize());
    let format: string | null = frame.format;
    frame.copyTo(buffer).then(res => {
      let input: Uint8Array = new Uint8Array(buffer);
      this.wamInfo_.wasmInterface_.HEAPU8.set(input, this.wamInfo_.inputMemoryOffset_);
      let output: Uint8ClampedArray = new Uint8ClampedArray(this.wamInfo_.wasmInterface_.HEAPU8.slice(this.wamInfo_.outputMemoryOffset_, this.wamInfo_.outputMemoryOffset_ + 410000));
    }).catch(e => {
    })
    
    controller.enqueue(frame)
  }

  flush(controller:TransformStreamDefaultController) {
  }
}

export default TestTransformer;