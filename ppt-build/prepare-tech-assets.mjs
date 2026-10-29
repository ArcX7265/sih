import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/ADARSH/Desktop/sih/prototype/package.json');
const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');const icons=require('lucide-react');
const dir='C:/Users/ADARSH/Desktop/sih/ppt-build/assets/tech-icons';await fs.mkdir(dir,{recursive:true});
for(const [name,icon,color] of [['institution','Landmark','#111111'],['access','ShieldCheck','#111111'],['versions','Files','#111111'],['evidence','FileSearch','#111111'],['reminders','AlarmClock','#111111'],['workers','SquareCode','#FF5A00'],['d1','Database','#FF5A00'],['r2','Cylinder','#FF5A00']]){
await fs.writeFile(`${dir}/${name}.svg`,renderToStaticMarkup(React.createElement(icons[icon],{size:64,color,strokeWidth:1.7})));
}
const resp=await fetch('https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg');if(!resp.ok)throw Error(resp.status);const svg=(await resp.text()).replace('<svg ','<svg fill="#009EFF" ');await fs.writeFile(`${dir}/react.svg`,svg);console.log('Prepared 9 separate SVG icon files.');
