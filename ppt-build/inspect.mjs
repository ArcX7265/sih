import fs from 'node:fs/promises';
import {FileBlob,PresentationFile} from 'file:///C:/Users/ADARSH/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
const p=await PresentationFile.importPptx(await FileBlob.load('C:/Users/ADARSH/Downloads/SIH2026-IDEA-Presentation-Format (1).pptx'));
console.log((await p.inspect({select:'$.slides[*]',include:['id','index','elements.id','elements.text','elements.position','elements.style']})).ndjson);
console.log('MASTERS',p.masters.items.map(x=>({id:x.id,name:x.name})));
for(const [i,s] of p.slides.items.entries()) {const blob=await p.export({slide:s,format:'png',scale:1});await fs.writeFile(`C:/Users/ADARSH/Desktop/sih/ppt-build/source-${i+1}.png`,new Uint8Array(await blob.arrayBuffer()));}
