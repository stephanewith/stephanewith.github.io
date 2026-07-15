const { useState, useMemo } = React;
const { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip, ReferenceLine, LabelList } = Recharts;
const h = React.createElement;

const C = { western:'#4863f7', nordic:'#2bd4c4', southern:'#f5a623', eastern:'#e5449b',
            inkSoft:'#9aa3c0', line:'rgba(255,255,255,.09)' };
const CLUST_COLOR = { 'Western':C.western, 'Nordic':C.nordic, 'Southern':C.southern, 'Central/Eastern':C.eastern };
const D = AEI_DATA.countries;

function Flag({code,size=20}){
  return h('span',{className:'flag',style:{width:size,height:size},
    dangerouslySetInnerHTML:{__html:'<svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'">'+(FLAGS[code]||'')+'</svg>'}});
}
function TT({active,payload,fmt}){
  if(!active||!payload||!payload.length) return null;
  return h('div',{className:'tt'},
    h('div',{style:{fontWeight:600,marginBottom:4}}, payload[0].payload.name),
    payload.map((p,i)=>h('div',{key:i,style:{color:p.color||p.fill}}, p.name+': '+(fmt?fmt(p.value):p.value))));
}
const clusterLegend = () => h('div',{className:'legend'},
  Object.entries(CLUST_COLOR).map(([k,v])=>h('b',{key:k},h('span',{className:'sw',style:{background:v}}),k)));

// ===== 1. Adoption =====
function AdoptionSection(){
  const rows = useMemo(()=>[...D].sort((a,b)=>b.usage_index-a.usage_index),[]);
  const max = Math.ceil(rows[0].usage_index);
  return h('section',{className:'block',id:'adoption'},
    h('p',{className:'eyebrow'},'01 — Adoption intensity'),
    h('h2',null,'Where AI has actually taken hold'),
    h('p',{className:'sub'},'Usage per capita index: a country\u2019s share of Claude usage divided by its share of the world\u2019s working-age population. 1.0 is exactly proportional. Almost all of Western and Northern Europe runs well above parity, led by Switzerland; parts of the East and South are still catching up.'),
    clusterLegend(),
    h('div',{className:'card'},
      h(ResponsiveContainer,{width:'100%',height:rows.length*23+30},
        h(BarChart,{data:rows,layout:'vertical',margin:{left:8,right:44,top:0,bottom:0}},
          h(XAxis,{type:'number',domain:[0,max],tickLine:false,axisLine:false}),
          h(YAxis,{type:'category',dataKey:'name',width:110,tickLine:false,axisLine:false,tick:{fontSize:10.5}}),
          h(Tooltip,{content:h(TT,{fmt:v=>v.toFixed(2)+'x'}),cursor:{fill:'rgba(255,255,255,.04)'}}),
          h(ReferenceLine,{x:1,stroke:C.inkSoft,strokeDasharray:'3 3',label:{value:'parity',position:'top',fill:C.inkSoft,fontSize:10}}),
          h(Bar,{dataKey:'usage_index',name:'Usage index',radius:[0,4,4,0]},
            rows.map((r,i)=>h(Cell,{key:i,fill:CLUST_COLOR[r.cluster]})),
            h(LabelList,{dataKey:'usage_index',position:'right',fontSize:9.5,fill:C.inkSoft,formatter:v=>v.toFixed(1)}))
        ))));
}

// ===== 2. Automation vs Augmentation =====
function CollabSection(){
  const [sel,setSel] = useState(null);
  const rows = useMemo(()=>[...D].sort((a,b)=>b.automation-a.automation),[]);
  return h('section',{className:'block',id:'collab'},
    h('p',{className:'eyebrow'},'02 — Automation vs augmentation'),
    h('h2',null,'Southern and Eastern Europe automate. The Nordics collaborate.'),
    h('p',{className:'sub'},'Every conversation leans one way: automation (\u201cdo the task for me\u201d) or augmentation (\u201cwork through it with me\u201d). Across Europe the split runs on a gentle gradient, with the Nordics and Belgium the most collaborative, and the South and East more automation-led.'),
    h('div',{className:'legend'},
      h('b',null,h('span',{className:'sw',style:{background:C.southern}}),'Automation'),
      h('b',null,h('span',{className:'sw',style:{background:C.nordic}}),'Augmentation'),
      h('span',{className:'pill hint',style:{marginLeft:'auto'}},'Tap a country to isolate it')),
    h('div',{className:'selrow'}, rows.map(r=>h('span',{key:r.code,className:'chip','data-on':sel===r.code?'1':'0',
        onClick:()=>setSel(sel===r.code?null:r.code)}, r.code))),
    h('div',{className:'card'},
      h(ResponsiveContainer,{width:'100%',height:rows.length*22+30},
        h(BarChart,{data:rows,layout:'vertical',stackOffset:'expand',margin:{left:8,right:16,top:0,bottom:0}},
          h(XAxis,{type:'number',hide:true,domain:[0,1]}),
          h(YAxis,{type:'category',dataKey:'name',width:110,tickLine:false,axisLine:false,tick:{fontSize:10.5}}),
          h(Tooltip,{content:h(TT,{fmt:v=>v.toFixed(1)+'%'}),cursor:{fill:'rgba(255,255,255,.04)'}}),
          h(ReferenceLine,{x:0.5,stroke:C.inkSoft,strokeDasharray:'2 2'}),
          h(Bar,{dataKey:'automation',name:'Automation',stackId:'a',radius:[4,0,0,4]},
            rows.map((r,i)=>h(Cell,{key:i,fill:C.southern,fillOpacity:sel&&sel!==r.code?0.18:0.92}))),
          h(Bar,{dataKey:'augmentation',name:'Augmentation',stackId:'a',radius:[0,4,4,0]},
            rows.map((r,i)=>h(Cell,{key:i,fill:C.nordic,fillOpacity:sel&&sel!==r.code?0.18:0.92})))
        ))));
}

// ===== 3. Technical / coding =====
function TechSection(){
  const rows = useMemo(()=>[...D].sort((a,b)=>b.technical-a.technical),[]);
  const max = Math.ceil(rows[0].technical);
  return h('section',{className:'block',id:'technical'},
    h('p',{className:'eyebrow'},'03 — Technical output'),
    h('h2',null,'The AI coding heavy-hitters aren\u2019t where you\u2019d guess'),
    h('p',{className:'sub'},'Share of conversations whose main output is technical: a code fix, a script, or a database query. Central and Eastern Europe lead comfortably, with Serbia, Ukraine and Croatia on top, while the UK and Ireland sit near the bottom. This reflects what people build with Claude, not how skilled they are, and it maps closely onto Europe\u2019s established engineering economies.'),
    clusterLegend(),
    h('div',{className:'card'},
      h(ResponsiveContainer,{width:'100%',height:rows.length*23+30},
        h(BarChart,{data:rows,layout:'vertical',margin:{left:8,right:48,top:0,bottom:0}},
          h(XAxis,{type:'number',domain:[0,max],tickLine:false,axisLine:false,tickFormatter:v=>v+'%'}),
          h(YAxis,{type:'category',dataKey:'name',width:110,tickLine:false,axisLine:false,tick:{fontSize:10.5}}),
          h(Tooltip,{content:h(TT,{fmt:v=>v.toFixed(2)+'%'}),cursor:{fill:'rgba(255,255,255,.04)'}}),
          h(Bar,{dataKey:'technical',name:'Technical share',radius:[0,4,4,0]},
            rows.map((r,i)=>h(Cell,{key:i,fill:CLUST_COLOR[r.cluster]})),
            h(LabelList,{dataKey:'technical',position:'right',fontSize:9.5,fill:C.inkSoft,formatter:v=>v.toFixed(1)+'%'}))
        ))));
}

function Hero(){
  const byIdx=[...D].sort((a,b)=>b.usage_index-a.usage_index);
  const byTech=[...D].sort((a,b)=>b.technical-a.technical);
  const topA=byIdx[0], topT=byTech[0];
  return h('div',{className:'hero'},
    h('p',{className:'eyebrow'},'Anthropic Economic Index · May 2026 · CC-BY'),
    h('h1',null,'How ',h('span',{className:'grad'},'Europe'),' works with Claude'),
    h('p',{className:'lede'},'Thirty-three markets, and three things the data makes clear: where AI adoption runs deepest, whether people automate or collaborate, and where Claude is used to write code.'),
    h('div',{className:'statrow'},
      h('div',{className:'stat'},h('div',{className:'n',style:{color:C.western}},topA.usage_index.toFixed(1)+'x'),h('div',{className:'l'},topA.name+' leads adoption')),
      h('div',{className:'stat'},h('div',{className:'n',style:{color:C.eastern}},topT.technical.toFixed(1)+'%'),h('div',{className:'l'},topT.name+' tops technical use')),
      h('div',{className:'stat'},h('div',{className:'n',style:{color:C.nordic}},'59%'),h('div',{className:'l'},'Norway augments most, not automates')),
      h('div',{className:'stat'},h('div',{className:'n',style:{color:C.southern}},'33'),h('div',{className:'l'},'European markets analysed'))
    ));
}

function App(){
  return h('div',{className:'wrap'},
    h(Hero), h(AdoptionSection), h(CollabSection), h(TechSection),
    h('div',{className:'footer'},
      h('p',null,'Source: ',h('a',{href:'https://www.anthropic.com/research/economic-index-june-2026-report',target:'_blank',rel:'noopener'},'Anthropic Economic Index'),', release 2026-06-26, May 2026 data. Licensed CC-BY. Usage index = share of Claude usage \u00f7 share of world working-age population. Technical share = code-fix + script + database-query artifacts. Covers all 33 European markets in the dataset.'),
      h('p',{style:{marginTop:'.6rem'}},'Built by Stef With \u00b7 ',h('a',{href:'https://stephanewith.github.io/',target:'_blank',rel:'noopener'},'stephanewith.github.io')));
}
ReactDOM.createRoot(document.getElementById('root')).render(h(App));
