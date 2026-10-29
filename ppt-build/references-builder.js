presentation.slides.keep([]);presentation.theme.defaultFont='Times New Roman';
const s=presentation.slides.add({width:1672,height:941,background:{fill:'#FFFFFF'}});
const box=(name,x,y,w,h,fill='#FFFFFF',stroke='#000000',sw=1.7)=>s.shapes.add({name,geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:stroke,width:sw,style:'solid'}});
const txt=(name,text,x,y,w,h,fontSize=27,bold=false,alignment='left',color='#000000')=>{const a=s.shapes.add({name,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=text;a.text.style={typeface:'Times New Roman',fontSize,bold,alignment,color,lineSpacing:1,verticalAlignment:'top'};a.text.insets=0;return a;};
const word=txt('NidhiSetu wordmark','',40,15,310,67,59,true);word.text=[{run:'Nidhi',style:{bold:true,color:'#0B2545'}},{run:'Setu',style:{bold:true,color:'#00856C'}}];
txt('Slide title','RESEARCH AND REFERENCES',354,17,1083,66,56,true,'center');s.images.add({path:'C:/Users/ADARSH/Desktop/sih/ppt-build/assets/image2.png',alt:'Original SIH2026 logo',position:{left:1451,top:9,width:195,height:82},fit:'contain'});
box('Bibliography frame',38,104,1595,790);
const refs=[
['AICTE. Approval Process Handbook 2024–2027','Domain reference for security deposits and release procedures.',['https://www.aicte.gov.in/sites/default/files/APH%20Final.pdf']],
['Sandhu, Coyne, Feinstein & Youman (1996). Role-Based Access Control Models','Reference for role permissions and separation of responsibilities.',['https://csrc.nist.gov/csrc/media/projects/role-based-access-control/documents/sandhu96.pdf']],
['OWASP. Logging Cheat Sheet','Guidance for recording application events and protecting logs.',['https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html']],
['OWASP. File Upload Cheat Sheet','Guidance for file checks, upload restrictions and controlled document access.',['https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html']],
['National Informatics Centre. eOffice','Related government example of electronic files and workflow management.',['https://www.nic.gov.in/project/eoffice/']],
['Cloudflare. D1 and R2 Documentation','Implementation references for structured records and object storage.',['https://developers.cloudflare.com/d1/','https://developers.cloudflare.com/r2/']],
['React. Official Documentation','Implementation reference for reusable portal components and interactive workspaces.',['https://react.dev/learn']],
['Microsoft. TypeScript Documentation','Implementation reference for typed data structures and application code.',['https://www.typescriptlang.org/docs/']]
];
refs.forEach(([title,description,urls],i)=>{const y=112+i*98;txt('Reference '+(i+1)+' bullet','•',73,y-2,30,34,32,true);txt('Reference '+(i+1)+' title',title,113,y,1490,34,29,true);txt('Reference '+(i+1)+' relevance',description,113,y+32,1490,31,26.5);const a=txt('Reference '+(i+1)+' hyperlink','',113,y+61,1490,31,26.5);a.text=urls.flatMap((url,j)=>[...(j?[{run:'     '}]:[]),{run:url,style:{color:'#006DD2',underline:'sng'},link:{uri:url,isExternal:true}}]);});
box('Blue footer',0,902,1672,39,'#0077BE','none',0);txt('Footer wordmark','NidhiSetu',650,905,372,36,31,false,'center','#FFFFFF');txt('Slide number','6',1577,906,44,34,28,false,'center','#FFFFFF');
s.speakerNotes.text='Recreated from the updated eight-reference slide as native editable PowerPoint text. Every displayed source URL is a clickable hyperlink. AICTE and NIST references inform domain and access-control design. OWASP references cover application logging and file-upload controls. NIC eOffice is a related government workflow example. Cloudflare, React and TypeScript documentation support technologies used in the prototype. References do not imply certification, endorsement or completed production integration. Original SIH2026 logo sourced from the user presentation template.';
await presentation.render({slide:0,fileName:'references-preview.png'});return await presentation.export({format:'pptx',fileName:'NidhiSetu-Research-and-References.pptx'});
