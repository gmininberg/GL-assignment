import SimdModule from './simd.js'

export interface WasmInterface extends EmscriptenModule {
  _getInputBuffer(): number
  _getOutputBuffer(): number
  _someFunction(): number
  _someFunction2(x: number): number
}

export class WasmInfo {
  wasmInterface_!: WasmInterface
  inputMemoryOffset_: number = 0;
  outputMemoryOffset_: number = 0;
}


export async function WasmLoader(uri: string): Promise<WasmInfo> {
  let wasmInfo: WasmInfo = new WasmInfo();

  var promise = new Promise<WasmInfo>(function(resolve, reject) {
    async function loadWasm(): Promise<WasmInterface> {
      const helper = {
        'locateFile': function(path: string) {
          return uri + path;
        }
      };
      return SimdModule(helper);
    }
    
    async function loadWasmModel(wasm: WasmInterface): Promise<void> {
      return new Promise<void>(async (resolve, reject) => {
        const newSelectedWasm = wasm;
    
        if (typeof newSelectedWasm === "undefined") {
          return reject(`backend unavailable: wasmSimd`);
        }
    
        try {
          wasmInfo.inputMemoryOffset_ = newSelectedWasm._getInputBuffer();
          wasmInfo.outputMemoryOffset_ = newSelectedWasm._getOutputBuffer();
          wasmInfo.wasmInterface_ = newSelectedWasm;
        } catch(error) {
          reject(error);
          return;
        }
        resolve();
      })
    }
  
    loadWasm().then(wasm => {
      if(wasm === null){
        console.error("loadTFLite null");
        throw("loadTFLite null");
      }
      loadWasmModel(wasm).then( resolved => {
        resolve(wasmInfo);
      }).catch(err => {
        console.error("loadTFLiteModel error");
        reject("loadTFLiteModel error");
      });
    }).catch(e => {
      console.error("loadTFLite error:", e);
      reject("loadTFLite error:" + e);
    });
  });

  return promise;
}
