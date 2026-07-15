const { useState, useMemo } = React;
const { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip, ReferenceLine, LabelList } = Recharts;
const h = React.createElement;

const C = { western:'#4863f7', nordic:'#2bd4c4', southern:'#f5a623', eastern:'#e5449b',
            inkSoft:'#9aa3c0', line:'rgba(255,255,255,.09)' };
const CLUST_COLOR = { 'Western':C.western, 'Nordic':C.nordic, 'Southern':C.southern, 'Central/Eastern':C.eastern };
const D = AEI_DATA.countries;

function Flag(props){
  const size = props.size || 20;
  return h('span', { className:'flag', style:{ width:size, height:size },
    dangerouslySetInnerHTML:{ __html:'<svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'">'+(FLAGS[props.code]||'')+'</svg>' } });
}

function TT(props){
  if (!props.active || !props.payload || !props.payload.length) return null;
  const fmt = props.fmt;
  return h('div', { className:'tt' },
    h('div', { style:{ fontWeight:600, marginBottom:4 } }, props.payload[0].payload.name),
    props.payload.map(function(p, i){
      return h('div', { key:i, style:{ color:p.color||p.fill } }, p.name+': '+(fmt ? fmt(p.value) : p.value));
    }));
}

function clusterLegend(){
  return h('div', { className:'legend' },
    Object.keys(CLUST_COLOR).map(function(k){
      return h('b', { key:k }, h('span', { className:'sw', style:{ background:CLUST_COLOR[k] } }), k);
    }));
}

// ===== 1. Marketing content output =====
function ContentSection(){
  const rows = useMemo(function(){ return D.slice().sort(function(a,b){ return b.content-a.content; }); }, []);
  const max = Math.ceil(rows[0].content);
  return h('section', { className:'block', id:'content' },
    h('p', { className:'eyebrow' }, '01 \u2014 Marketing content output'),
    h('h2', null, 'Where marketing content gets made'),
    h('p', { className:'sub' }, 'Share of each market\u2019s Claude conversations whose main output is marketing or social content. These are small slices of total usage, so what matters is the relative lean: Ukraine, Cyprus and Malta produce the most marketing content, while the Nordics and Luxembourg produce the least.'),
    clusterLegend(),
    h('div', { className:'card' },
      h(ResponsiveContainer, { width:'100%', height:rows.length*23+30 },
        h(BarChart, { data:rows, layout:'vertical', margin:{ left:8, right:44, top:0, bottom:0 } },
          h(XAxis, { type:'number', domain:[0,max], tickLine:false, axisLine:false, tickFormatter:function(v){ return v+'%'; } }),
          h(YAxis, { type:'category', dataKey:'name', width:110, tickLine:false, axisLine:false, tick:{ fontSize:10.5 } }),
          h(Tooltip, { content:h(TT, { fmt:function(v){ return v.toFixed(2)+'%'; } }), cursor:{ fill:'rgba(255,255,255,.04)' } }),
          h(Bar, { dataKey:'content', name:'Marketing content share', radius:[0,4,4,0] },
            rows.map(function(r,i){ return h(Cell, { key:i, fill:CLUST_COLOR[r.cluster] }); }),
            h(LabelList, { dataKey:'content', position:'right', fontSize:9.5, fill:C.inkSoft, formatter:function(v){ return v.toFixed(1)+'%'; } }))
        ))));
}

// ===== 2. Execution vs strategy =====
function RatioSection(){
  const rows = useMemo(function(){ return D.slice().sort(function(a,b){ return b.exec_ratio-a.exec_ratio; }); }, []);
  return h('section', { className:'block', id:'ratio' },
    h('p', { className:'eyebrow' }, '02 \u2014 Execution vs strategy'),
    h('h2', null, 'Making content, or planning it?'),
    h('p', { className:'sub' }, 'The ratio of marketing-content output to strategy-and-planning output. Above 1.0 means a market uses Claude more to make marketing content than to plan it; below 1.0 means the reverse. Ukraine and Malta are the most execution-led, while Iceland, Luxembourg and Norway lean heavily toward strategy, using AI three to four times more for planning than for producing content.'),
    h('div', { className:'legend' },
      h('b', null, h('span', { className:'sw', style:{ background:C.eastern } }), 'Execution-led (ratio > 1)'),
      h('b', null, h('span', { className:'sw', style:{ background:C.western } }), 'Strategy-led (ratio < 1)')),
    h('div', { className:'card' },
      h(ResponsiveContainer, { width:'100%', height:rows.length*23+30 },
        h(BarChart, { data:rows, layout:'vertical', margin:{ left:8, right:48, top:0, bottom:0 } },
          h(XAxis, { type:'number', domain:[0,1.4], tickLine:false, axisLine:false }),
          h(YAxis, { type:'category', dataKey:'name', width:110, tickLine:false, axisLine:false, tick:{ fontSize:10.5 } }),
          h(Tooltip, { content:h(TT, { fmt:function(v){ return v.toFixed(2)+'x'; } }), cursor:{ fill:'rgba(255,255,255,.04)' } }),
          h(ReferenceLine, { x:1, stroke:C.inkSoft, strokeDasharray:'3 3', label:{ value:'balanced', position:'top', fill:C.inkSoft, fontSize:10 } }),
          h(Bar, { dataKey:'exec_ratio', name:'Content-to-strategy ratio', radius:[0,4,4,0] },
            rows.map(function(r,i){ return h(Cell, { key:i, fill:r.exec_ratio>=1 ? C.eastern : C.western }); }),
            h(LabelList, { dataKey:'exec_ratio', position:'right', fontSize:9.5, fill:C.inkSoft, formatter:function(v){ return v.toFixed(2); } }))
        ))));
}

// ===== 3. Marketing work mix (per country, selectable) =====
function MixSection(){
  const [sel, setSel] = useState('FRA');
  const country = D.find(function(c){ return c.code===sel; });
  const mix = [
    { label:'Marketing / social content', val:country.content, color:C.eastern },
    { label:'Email & messaging', val:country.email, color:C.western },
    { label:'Plan & strategy', val:country.strategy, color:C.amber || C.southern },
    { label:'Creative writing', val:country.creative, color:C.nordic },
    { label:'Presentations & slides', val:country.slides, color:'#9b8cff' },
    { label:'Images & graphics', val:country.image, color:'#f5c542' }
  ].filter(function(m){ return m.val!=null; }).sort(function(a,b){ return b.val-a.val; });

  return h('section', { className:'block', id:'mix' },
    h('p', { className:'eyebrow' }, '03 \u2014 The marketing work mix'),
    h('h2', null, 'What AI-assisted marketing actually produces'),
    h('p', { className:'sub' }, 'For any market, the breakdown of marketing-relevant output types. Pick a country to see how its mix of content, email, strategy, creative writing, decks and graphics compares. Most marketing work across Europe is email and written content, with strategy close behind.'),
    h('div', { className:'selrow' },
      D.slice().sort(function(a,b){ return a.name.localeCompare(b.name); }).map(function(r){
        return h('span', { key:r.code, className:'chip', 'data-on':sel===r.code?'1':'0',
          onClick:function(){ setSel(r.code); } }, r.code);
      })),
    h('div', { className:'card' },
      h('div', { style:{ display:'flex', alignItems:'center', gap:'.6em', marginBottom:'1rem' } },
        h(Flag, { code:country.code, size:24 }),
        h('span', { style:{ fontFamily:'Space Grotesk', fontWeight:600, fontSize:'1.1rem' } }, country.name)),
      h(ResponsiveContainer, { width:'100%', height:mix.length*40+20 },
        h(BarChart, { data:mix, layout:'vertical', margin:{ left:8, right:44, top:0, bottom:0 } },
          h(XAxis, { type:'number', tickLine:false, axisLine:false, tickFormatter:function(v){ return v+'%'; } }),
          h(YAxis, { type:'category', dataKey:'label', width:150, tickLine:false, axisLine:false, tick:{ fontSize:11 } }),
          h(Tooltip, { content:h(TT, { fmt:function(v){ return v.toFixed(2)+'%'; } }), cursor:{ fill:'rgba(255,255,255,.04)' } }),
          h(Bar, { dataKey:'val', name:'Share of usage', radius:[0,4,4,0] },
            mix.map(function(m,i){ return h(Cell, { key:i, fill:m.color }); }),
            h(LabelList, { dataKey:'val', position:'right', fontSize:10, fill:C.inkSoft, formatter:function(v){ return v.toFixed(1)+'%'; } }))
        ))));
}

function Hero(){
  const byContent = D.slice().sort(function(a,b){ return b.content-a.content; });
  const topC = byContent[0];
  const byRatio = D.slice().sort(function(a,b){ return b.exec_ratio-a.exec_ratio; });
  return h('div', { className:'hero' },
    h('p', { className:'eyebrow' }, 'Anthropic Economic Index \u00b7 May 2026 \u00b7 CC-BY'),
    h('h1', null, 'How ', h('span', { className:'grad' }, 'Europe'), ' markets with Claude'),
    h('p', { className:'lede' }, 'Thirty-three markets through a marketing lens: where AI-assisted marketing content gets made, whether teams use it to execute or to plan, and what that work actually looks like.'),
    h('div', { className:'statrow' },
      h('div', { className:'stat' }, h('div', { className:'n', style:{ color:C.eastern } }, topC.content.toFixed(1)+'%'), h('div', { className:'l' }, topC.name+' makes the most marketing content')),
      h('div', { className:'stat' }, h('div', { className:'n', style:{ color:C.western } }, byRatio[byRatio.length-1].exec_ratio.toFixed(2)+'x'), h('div', { className:'l' }, byRatio[byRatio.length-1].name+' is the most strategy-led')),
      h('div', { className:'stat' }, h('div', { className:'n', style:{ color:C.nordic } }, '33'), h('div', { className:'l' }, 'European markets analysed')),
      h('div', { className:'stat' }, h('div', { className:'n', style:{ color:C.southern } }, 'CC-BY'), h('div', { className:'l' }, 'Anthropic Economic Index, May 2026'))
    ));
}

function App(){
  return h('div', { className:'wrap' },
    h(Hero),
    h(ContentSection),
    h(RatioSection),
    h(MixSection),
    h('div', { className:'footer' },
      h('p', null, 'Source: ', h('a', { href:'https://www.anthropic.com/research/economic-index-june-2026-report', target:'_blank', rel:'noopener' }, 'Anthropic Economic Index'), ', release 2026-06-26, May 2026 data. Licensed CC-BY. All figures are shares of each market\u2019s Claude.ai and Cowork conversations, covering all 33 European markets in the dataset. Marketing-content, strategy, and creative categories are inferred from conversation output.'),
      h('p', { style:{ marginTop:'.6rem' } }, 'Built by Stef With \u00b7 ', h('a', { href:'https://stephanewith.github.io/', target:'_blank', rel:'noopener' }, 'stephanewith.github.io')))
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
