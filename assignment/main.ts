import { MediaProcessor, MediaProcessorConnector } from "@vonage/media-processor";
import CameraSource from "./camera-source";
import EmptyTransformer from "./empty-transform";

async function main() {
  const sourceSelector: any =document.getElementById('sourceSelector');

  let source_: CameraSource = new CameraSource();
  async function updatePipelineSource() {
    const sourceType = sourceSelector.options[sourceSelector.selectedIndex].value
    if(sourceType === 'camera'){
      
      for(let i = 0; i < 12; i++){
        let mediaProcessor: MediaProcessor = new MediaProcessor()
        let transformers: Array<Transformer> = []
        transformers.push(new EmptyTransformer())
        mediaProcessor.setTransformers(transformers)
        let connector: MediaProcessorConnector = new MediaProcessorConnector(mediaProcessor)
        source_.setMediaProcessorConnector(connector)
      }
    }
  }
  sourceSelector.oninput = updatePipelineSource;
  sourceSelector.disabled = false;
}

window.onload = main;
