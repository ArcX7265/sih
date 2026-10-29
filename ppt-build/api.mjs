import {FileBlob,PresentationFile} from 'file:///C:/Users/ADARSH/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
const p=await PresentationFile.importPptx(await FileBlob.load('C:/Users/ADARSH/Downloads/SIH2026-IDEA-Presentation-Format (1).pptx'));
console.log(p.help('*',{search:'slides remove delete shapes remove',include:['index','notes'],maxChars:4000}));
console.log('PROTO',Object.keys(p.toProto()),'SLIDES',Object.getOwnPropertyNames(Object.getPrototypeOf(p.slides)),'SHAPES',Object.getOwnPropertyNames(Object.getPrototypeOf(p.slides.items[0].shapes)));
