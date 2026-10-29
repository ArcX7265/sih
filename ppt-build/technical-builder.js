presentation.slides.keep([]);presentation.theme.defaultFont='Times New Roman';
const s=presentation.slides.add({width:1672,height:941,background:{fill:'#FFFFFF'}});
const C={peach:'#FDEADC',mint:'#E5FBE9',purple:'#EEE5FC',cream:'#FFF6CD',cyan:'#D8F8F4'};
const box=(name,x,y,w,h,fill='#FFFFFF',stroke='#000000',sw=1.7,r=0,dash='solid')=>s.shapes.add({name,geometry:r?'roundRect':'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:stroke,width:sw,style:dash},...(r?{borderRadius:r}:{})});
const txt=(name,text,x,y,w,h,size=23,bold=false,alignment='left',color='#000000')=>{const a=s.shapes.add({name,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=text;a.text.style={typeface:'Times New Roman',fontSize:size,bold,color,alignment,verticalAlignment:'top'};a.text.insets=0;return a;};
const icon=(name,x,y,w=46,h=46)=>s.images.add({path:`C:/Users/ADARSH/Desktop/sih/ppt-build/assets/tech-icons/${name}.svg`,alt:name+' icon from Lucide',position:{left:x,top:y,width:w,height:h},fit:'contain'});
const path=(name,points)=>{for(let i=0;i<points.length-1;i++){const [x,y]=points[i],[xx,yy]=points[i+1];s.shapes.add({name:name+' segment '+i,geometry:'connector',kind:'straight',position:{left:Math.min(x,xx),top:Math.min(y,yy),width:Math.abs(xx-x),height:Math.abs(yy-y),horizontalFlip:xx<x,verticalFlip:yy<y},line:{fill:'#000000',width:1.8,style:'solid'},...(i===points.length-2?{tail:{type:'triangle',width:'med',length:'med'}}:{})});}};
const word=txt('NidhiSetu wordmark','',24,11,310,66,57,true);word.text=[{run:'Nidhi',style:{bold:true,color:'#0B2545'}},{run:'Setu',style:{bold:true,color:'#008F70'}}];
txt('Slide title','TECHNICAL APPROACH',377,8,940,73,60,true,'center');s.images.add({path:'C:/Users/ADARSH/Desktop/sih/ppt-build/assets/image2.png',alt:'Original SIH2026 logo',position:{left:1464,top:6,width:188,height:79},fit:'contain'});
for(const [n,x,w,title] of [[1,18,357,'Users & Evidence Sources'],[2,381,379,'Portal Interface'],[3,767,482,'Application & Workflow'],[4,1256,400,'Data & Follow-up']]){box('Zone '+n+' outline',x,90,w,707,'none','#333333',1.2,10,'dotted');txt('Zone '+n+' heading','Zone '+n+'\n'+title,x+8,97,w-16,61,26,true,'center');}
box('React TypeScript portal container',407,173,326,380);txt('Portal stack heading','React + TypeScript',423,177,293,30,24,true,'center');
box('Workflow container',849,173,375,521);txt('Runtime heading','Vinext on Cloudflare Workers',862,177,350,30,24,true,'center');
box('Release workflow container',783,704,857,84);
// Source and workspace blocks.
box('Institution source',45,216,300,110,C.peach);icon('institution',64,229,43,46);txt('Institution title','Institution',126,226,207,28,24,true);txt('Institution description','FDR details, supporting\nfiles, corrections and\nrequests',126,255,211,65,22);
box('Review officer source',45,376,300,99,C.peach);txt('Review officer title','Review officer & authority',69,388,270,28,23,true);txt('Review officer description','Scrutiny and release\ndecisions',69,422,260,47,22);
box('Bank source',42,566,303,87,C.peach);txt('Bank source title','Bank evidence adapter',67,582,266,28,23,true);txt('Bank simulation label','SIMULATED IN PROTOTYPE',67,617,267,28,21);
box('Institution workspace',435,216,276,86,C.mint);txt('Institution workspace heading','Institution workspace',458,223,249,29,23,true);txt('Institution workspace body','Submit FDR, attach\ndocuments, track requests',458,252,249,48,21);
box('Officer workspace',435,337,276,90,C.mint);txt('Officer workspace heading','Officer workspace',461,345,244,29,23,true);txt('Officer workspace body','Review evidence and\nrequest corrections',461,376,243,48,21);
box('Authority workspace',435,446,276,89,C.mint);txt('Authority workspace heading','Authority workspace',459,453,247,29,23,true);txt('Authority workspace body','Review release prerequisites\nand approve',459,485,247,47,21);
// Workflow blocks.
box('API controls',879,213,318,77,C.purple);icon('access',905,223,42,46);txt('API heading','API & access controls',967,219,225,27,23,true);txt('API body','Role permissions and\ninstitution scope',967,246,226,44,21);
box('Version service',879,315,318,83,C.cream);icon('versions',901,326,43,46);txt('Version heading','Deposit version service',969,322,225,29,22,true);txt('Version body','Saved submissions and\ncorrection history',969,351,225,44,21);
box('Evidence comparison',879,423,318,76,C.mint);icon('evidence',902,434,44,46);txt('Evidence heading','Evidence comparison',969,429,224,27,23,true);txt('Evidence body','Field differences and\nevidence applicability',969,455,224,43,21);
box('Lifecycle rules',879,523,318,73,C.peach);txt('Lifecycle heading','Lifecycle rules',890,527,296,28,23,true,'center');txt('Lifecycle body','Maturity, renewal and\ncontrolled release',891,555,294,40,21,false,'center');
box('Audit events',879,614,318,71,C.purple);txt('Audit heading','Audit events',889,617,298,27,23,true,'center');txt('Audit body','Actor, action, time and\nrecord version',889,643,298,42,21,false,'center');
box('D1 storage',1340,216,299,94,C.cyan);txt('D1 heading','Cloudflare D1',1383,224,250,28,24,true);txt('D1 body','Versions, evidence,\nrequests and audit records',1383,255,250,48,21);
box('R2 storage',1396,366,243,95,C.purple);txt('R2 heading','Cloudflare R2',1428,377,206,28,24,true);txt('R2 body','Private supporting\ndocuments',1428,408,206,46,21);
box('Reminder queue',1340,519,299,80,C.cream);icon('reminders',1351,534,45,43);txt('Reminder heading','Maturity reminder queue',1408,534,228,27,22,true);txt('Reminder body','Deduplicated, run on demand',1408,565,227,27,19.5);
// Individually editable routed connectors.
path('Institution submits',[[345,260],[435,260]]);
path('Officer reviews',[[345,416],[396,416],[396,379],[435,379]]);path('Authority reviews',[[396,416],[396,479],[435,479]]);
path('Portal requests',[[711,245],[879,245]]);path('Workflow status',[[879,273],[711,273]]);
path('Bank confirmation evidence',[[345,605],[813,605],[813,461],[879,461]]);
path('Authority to workflow',[[711,461],[879,461]]);
for(const [a,b] of [[290,315],[398,423],[499,523],[596,614]])path('Workflow next '+a,[[1041,a],[1041,b]]);
path('API persists',[[1197,250],[1316,250],[1316,283],[1340,283]]);
path('Version data persistence',[[1197,360],[1356,360],[1356,310]]);
path('Lifecycle reminder',[[1197,560],[1340,560]]);
path('Audit supporting files',[[1197,645],[1313,645],[1313,407],[1396,407]]);
path('Release trigger',[[930,685],[930,731]]);
// Link labels have white backing to keep zone outlines out of the lettering.
box('Requests label backing',744,217,99,27,'#FFFFFF','none',0);txt('Requests label','Requests',750,217,95,27,21);
box('Status label backing',748,277,87,26,'#FFFFFF','none',0);txt('Status label','Status',758,278,76,26,21);
box('Confirmation label backing',515,561,160,43,'#FFFFFF','none',0);txt('Confirmation label','Confirmation\nevidence',515,562,160,43,20,false,'center');
box('Material edit label backing',1232,317,86,76,'#FFFFFF','none',0);txt('Material edit rule','Material edits\nrequire fresh\napplicable\nevidence',1233,318,84,75,16.5,false,'center');
txt('Release heading','Release on request',1032,705,303,27,22,true,'center');
box('Prerequisites step',799,731,250,34,C.mint);txt('Prerequisites text','Check prerequisites',805,735,238,28,20,false,'center');
box('Approval step',1090,731,235,34,C.purple);txt('Approval text','Authority approval',1096,735,223,28,20,false,'center');
box('Completion step',1373,731,251,34,C.peach);txt('Completion text','Record completion',1379,735,239,28,20,false,'center');
path('Prerequisites to approval',[[1049,748],[1090,748]]);path('Approval to completion',[[1325,748],[1373,748]]);txt('Pending request disclosure','Missing checks keep request pending',1005,768,392,22,17,false,'center');
// Technology strip, each icon and wordmark is a separate object.
box('Technology strip',18,811,1638,72,'#FFFFFF','#000000',1.5,7);txt('Technologies heading','Technologies used',37,833,185,31,24,true);
for(const x of [222,430,657,933,1170,1427])box('Technology separator '+x,x,823,1,53,'#777777','none',0);
icon('react',247,824,48,48);txt('React label','React',313,831,100,26,22,true);txt('React description','Portal interface',313,856,112,22,16);
box('TypeScript logo tile',461,827,42,44,'#007ACC','none',0,4);txt('TypeScript glyph','TS',466,837,35,34,27,true,'center','#FFFFFF');txt('TypeScript label','TypeScript',522,831,130,26,22,true);txt('TypeScript description','Workflow rules',522,856,130,22,16);
const v=txt('Vinext wordmark','',697,827,117,42,36,true);v.text=[{run:'Vine',style:{bold:true}},{run:'x',style:{bold:true,color:'#13813F'}},{run:'t',style:{bold:true}}];txt('Vinext description','Full-stack framework',795,857,137,20,15);
icon('workers',983,831,43,43);txt('Workers label','Workers',1053,834,110,26,22,true);txt('Workers description','API runtime',1053,858,110,21,16);
txt('Cloudflare label','Cloudflare',1224,814,137,21,16,true);icon('d1',1212,833,43,43);txt('D1 label','D1',1278,835,130,24,21,true);txt('D1 description','Structured records',1278,859,144,21,16);
icon('r2',1456,832,43,43);txt('R2 label','R2',1517,835,120,24,21,true);txt('R2 description','Private documents',1517,859,133,21,16);
box('Blue footer',0,895,1672,46,'#007BD8','none',0);txt('Footer wordmark','NidhiSetu',650,900,372,38,32,false,'center','#FFFFFF');txt('Slide number','3',1578,902,42,34,28,false,'center','#FFFFFF');
s.speakerNotes.text='Architecture recreated from the supplied Technical Approach image as editable shapes, text and connectors. Bank responses are simulated in the prototype. The maturity reminder queue runs on demand. Original SIH2026 logo from the user presentation template. Separate Lucide icons are sourced from the installed lucide-react package, https://lucide.dev. React SVG icon source: https://github.com/simple-icons/simple-icons/blob/develop/icons/react.svg. TypeScript and Vinext labels are editable text treatments matching the reference. No screenshot or flattened slide image is used.';
await presentation.render({slide:0,fileName:'technical-preview.png'});return await presentation.export({format:'pptx',fileName:'NidhiSetu-Technical-Approach.pptx'});
