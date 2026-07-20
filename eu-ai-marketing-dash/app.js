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
  return h('div', { className:'legend legend--keyed' },
    h('span', { className:'legend-title' }, 'Bar colour = region:'),
    Object.keys(CLUST_COLOR).map(function(k){
      return h('b', { key:k }, h('span', { className:'sw', style:{ background:CLUST_COLOR[k] } }), k);
    }));
}

// ===== 1. Marketing content output =====
function ContentSection(){
  const rows = useMemo(function(){ return D.slice().sort(function(a,b){ return b.content-a.content; }); }, []);
  const max = Math.ceil(rows[0].content);
  return h('section', { className:'block', id:'content' },
    h('p', { className:'eyebrow' }, '01 \u00B7 Marketing content output'),
    h('h2', null, 'Where marketing content gets made'),
    h('p', { className:'sub' }, 'Share of each market\u2019s Claude conversations whose main output is marketing or social content. These are small slices of total usage, so what matters is the relative lean: Ukraine, Cyprus and Malta produce the most marketing content, while the Nordics and Luxembourg produce the least. Arrows show each market\u2019s movement since April: most markets softened slightly in May, while Cyprus bucked the trend, up 1.0pt in a single month.'),
    clusterLegend(),
    h('div', { style:{ fontSize:'.74rem', color:C.inkSoft, margin:'-.5rem 0 .9rem', fontFamily:'IBM Plex Mono, ui-monospace, monospace' } },
      h('span', { style:{ color:C.nordic } }, '\u25B2'), ' / ', h('span', { style:{ color:C.eastern } }, '\u25BC'),
      ' = percentage-point change in share vs April 2026'),
    h('div', { className:'card' },
      h(ResponsiveContainer, { width:'100%', height:rows.length*23+30 },
        h(BarChart, { data:rows, layout:'vertical', margin:{ left:8, right:84, top:0, bottom:0 } },
          h(XAxis, { type:'number', domain:[0,max], tickLine:false, axisLine:false, tickFormatter:function(v){ return v+'%'; } }),
          h(YAxis, { type:'category', dataKey:'name', width:118, tickLine:false, axisLine:false, tick:{ fontSize:12.5 } }),
          h(Tooltip, { content:h(TT, { fmt:function(v){ return v.toFixed(2)+'%'; } }), cursor:{ fill:'rgba(255,255,255,.04)' } }),
          h(Bar, { dataKey:'content', name:'Marketing content share', radius:[0,4,4,0] },
            rows.map(function(r,i){ return h(Cell, { key:i, fill:CLUST_COLOR[r.cluster] }); }),
            h(LabelList, { dataKey:'content', content:function(p){
              // Value label plus an April->May momentum marker per bar.
              var r = rows[p.index]; if (!r) return null;
              var d = r.content_apr != null ? r.content - r.content_apr : null;
              var show = d != null && Math.abs(d) >= 0.1;
              var up = d != null && d > 0;
              return h('g', null,
                h('text', { x:p.x + p.width + 5, y:p.y + p.height/2, dominantBaseline:'central',
                  fontSize:13, fontFamily:'IBM Plex Sans, system-ui, sans-serif', fill:C.inkSoft }, r.content.toFixed(1)+'%'),
                show ? h('text', { x:p.x + p.width + 52, y:p.y + p.height/2, dominantBaseline:'central',
                  fontSize:12, fill: up ? C.nordic : C.eastern },
                  (up ? '\u25B2' : '\u25BC') + Math.abs(d).toFixed(1)) : null);
            } }))
        ))));
}

// ===== Europe choropleth (sits alongside the section-2 bars) =====
// Topology + libs are vendored locally; nothing is fetched from a CDN at runtime.
const TOPO_URL = 'vendor/countries-110m.json'; // whole-world 110m topology, filtered to Europe by ISO id
const ISO_BY_CODE = {
  FRA:'250', GBR:'826', DEU:'276', ESP:'724', ITA:'380', NLD:'528', POL:'616',
  CHE:'756', BEL:'056', PRT:'620', UKR:'804', SWE:'752', ROU:'642', AUT:'040',
  NOR:'578', DNK:'208', CZE:'203', IRL:'372', GRC:'300', FIN:'246', HUN:'348',
  SRB:'688', BGR:'100', SVK:'703', HRV:'191', LTU:'440', SVN:'705', CYP:'196',
  EST:'233', LVA:'428', LUX:'442', MLT:'470', ISL:'352'
};
// Small-area markets rendered as clickable inset dots [lon,lat] so they stay usable.
// Malta and Cyprus are too small (and Cyprus too far SE) to tap reliably on the
// filled geography, so they get dedicated dots. Cyprus is nudged inboard from its
// true 33.4E so its dot sits inside the visible frame.
const INSET = { LUX:[6.1,49.8], MLT:[14.4,35.9], CYP:[33.0,35.05] };

function EuroMap(){
  const [sel, setSel] = useState('FRA');
  const hostRef = React.useRef(null);   // React-owned wrapper; React never puts children here
  const selRef = React.useRef(sel);     // lets D3 click handlers read latest sel without re-binding
  const [status, setStatus] = React.useState('loading');
  selRef.current = sel;

  const byIso = useMemo(function(){
    const m = {};
    D.forEach(function(c){ if (ISO_BY_CODE[c.code]) m[ISO_BY_CODE[c.code]] = c; });
    return m;
  }, []);
  const country = D.find(function(c){ return c.code === sel; });

  // Build the SVG once, into a D3-owned inner node that React does not manage.
  React.useEffect(function(){
    if (typeof d3 === 'undefined' || typeof topojson === 'undefined'){ setStatus('error'); return; }
    const host = hostRef.current; if (!host) return;
    // Create an inner div that belongs entirely to D3 (React's tree stays untouched).
    const inner = document.createElement('div');
    host.appendChild(inner);

    const noData = 'rgba(255,255,255,.08)', stroke = '#0b1020', W = 420, Ht = 480;
    const scale = d3.scaleDiverging(function(t){ return d3.interpolateRdBu(1 - t); }).domain([0.27, 1, 1.25]);
    const svg = d3.select(inner).append('svg')
      .attr('viewBox', '0 0 ' + W + ' ' + Ht).attr('width', '100%')
      .attr('role', 'img').attr('aria-label', 'Map of Europe shaded by the content-to-strategy ratio. Click a country to select it.');
    const proj = d3.geoConicConformal().rotate([-12,0]).center([9,52]).scale(540).translate([W/2 + 40, Ht/2 + 24]);
    const path = d3.geoPath(proj);

    function applyHighlight(){
      svg.selectAll('[data-code]').each(function(){
        const on = this.getAttribute('data-code') === selRef.current;
        this.setAttribute('stroke', on ? '#fff' : (this.tagName === 'circle' ? '#fff' : stroke));
        this.setAttribute('stroke-width', on ? 2 : (this.tagName === 'circle' ? 1.2 : 0.5));
      });
    }
    svg.node().__applyHighlight = applyHighlight; // expose for the highlight effect

    d3.json(TOPO_URL).then(function(topo){
      const key = topo.objects.countries ? 'countries' : Object.keys(topo.objects)[0];
      const feats = topojson.feature(topo, topo.objects[key]).features;
      svg.append('g').selectAll('path').data(feats).join('path')
        .attr('d', path)
        .attr('fill', function(f){ const c = byIso[f.id]; return c ? scale(c.exec_ratio) : noData; })
        .attr('stroke', stroke).attr('stroke-width', 0.5)
        .attr('data-code', function(f){ return byIso[f.id] ? byIso[f.id].code : ''; })
        .style('cursor', function(f){ return byIso[f.id] ? 'pointer' : 'default'; })
        .on('click', function(e,f){ if (byIso[f.id]) setSel(byIso[f.id].code); })
        .append('title').text(function(f){ const c = byIso[f.id]; return c ? c.name + ': ' + c.exec_ratio.toFixed(2) + 'x' : ''; });
      const g2 = svg.append('g');
      Object.keys(INSET).forEach(function(code){
        const c = D.find(function(x){ return x.code === code; }); if (!c) return;
        const xy = proj(INSET[code]); if (!xy) return;
        const gd = g2.append('g').style('cursor','pointer')
          .on('click', function(){ setSel(code); });
        gd.append('title').text(c.name + ': ' + c.exec_ratio.toFixed(2) + 'x');
        gd.append('circle').attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 7)
          .attr('fill', scale(c.exec_ratio)).attr('stroke', '#fff').attr('stroke-width', 1.2)
          .attr('data-code', code);
        var lx = code === 'CYP' ? xy[0] - 10 : xy[0] + 10;
        gd.append('text').attr('x', lx).attr('text-anchor', code === 'CYP' ? 'end' : 'start').attr('y', xy[1])
          .attr('dominant-baseline', 'central').attr('fill', '#e6e9f5')
          .attr('font-size', 10).attr('font-family', 'IBM Plex Mono, monospace')
          .attr('pointer-events', 'none').text(code);
      });
      applyHighlight();
      setStatus('ready');
    }).catch(function(){ setStatus('error'); });

    // Cleanup: D3 removes only its own node, so React's reconciliation is never disturbed.
    return function(){ if (inner.parentNode === host) host.removeChild(inner); };
  }, [byIso]);

  // Recolour the selected outline on change, operating only on D3's own SVG.
  React.useEffect(function(){
    const host = hostRef.current; if (!host) return;
    const svg = host.querySelector('svg'); if (!svg) return;
    if (svg.__applyHighlight) svg.__applyHighlight();
  }, [sel, status]);

  return h('div', { className:'mapwrap' },
    h('div', { className:'maplegend' },
      h('b', null, h('span', { className:'sw', style:{ background:'#3266ad' } }), 'Strategy-led (< 1)'),
      h('b', null, h('span', { className:'sw', style:{ background:'#eee7d8' } }), 'Balanced'),
      h('b', null, h('span', { className:'sw', style:{ background:'#c0392b' } }), 'Execution-led (> 1)')),
    h('div', { className:'mapgrid' },
      h('div', { className:'mapcanvas' },
        h('div', { ref:hostRef, style:{ width:'100%' } }),
        status === 'loading' ? h('p', { className:'maphint' }, 'Loading map\u2026') : null,
        status === 'error' ? h('p', { className:'maphint' }, 'Map unavailable; the ranked chart shows the same data.') : null),
      h('div', { className:'mapdetail' },
        h('p', { className:'mapdlabel' }, 'Selected market'),
        h('div', { style:{ display:'flex', alignItems:'center', gap:'.5em', margin:'0 0 .3rem' } },
          h(Flag, { code:country.code, size:22 }),
          h('span', { style:{ fontFamily:'Space Grotesk, system-ui, sans-serif', fontWeight:600, fontSize:'1.15rem' } }, country.name)),
        h('p', { className:'mapdratio' }, country.exec_ratio.toFixed(2) + '\u00d7'),
        h('p', { className:'mapdsub' }, 'content-to-strategy ratio'),
        h('div', { className:'mapdrows' },
          h('div', { className:'mapdrow' }, h('span', null, 'Marketing content'), h('b', null, country.content.toFixed(2)+'%')),
          h('div', { className:'mapdrow' }, h('span', null, 'Plan & strategy'), h('b', null, country.strategy.toFixed(2)+'%'))),
        h('p', { className:'mapdnote' }, 'Above 1: makes more marketing content than it plans. Below 1: leans to strategy. Click any country or dot.'))));
}

// ===== 2. Execution vs strategy =====
function RatioSection(){
  const rows = useMemo(function(){ return D.slice().sort(function(a,b){ return b.exec_ratio-a.exec_ratio; }); }, []);
  return h('section', { className:'block', id:'ratio' },
    h('p', { className:'eyebrow' }, '02 \u00B7 Execution vs strategy'),
    h('h2', null, 'Making content, or planning it?'),
    h('p', { className:'sub' }, 'The ratio of marketing-content output to strategy-and-planning output. Above 1.0 means a market uses Claude more to make marketing content than to plan it; below 1.0 means the reverse. Ukraine and Malta are the most execution-led, while Iceland, Luxembourg and Norway lean heavily toward strategy, using AI three to four times more for planning than for producing content.'),
    h('div', { className:'legend' },
      h('b', null, h('span', { className:'sw', style:{ background:C.eastern } }), 'Execution-led (ratio > 1)'),
      h('b', null, h('span', { className:'sw', style:{ background:C.western } }), 'Strategy-led (ratio < 1)')),
    h('div', { className:'card', style:{ marginBottom:'1rem' } }, h(EuroMap)),
    h('div', { className:'card' },
      h(ResponsiveContainer, { width:'100%', height:rows.length*23+30 },
        h(BarChart, { data:rows, layout:'vertical', margin:{ left:8, right:48, top:0, bottom:0 } },
          h(XAxis, { type:'number', domain:[0,1.4], tickLine:false, axisLine:false }),
          h(YAxis, { type:'category', dataKey:'name', width:118, tickLine:false, axisLine:false, tick:{ fontSize:12.5 } }),
          h(Tooltip, { content:h(TT, { fmt:function(v){ return v.toFixed(2)+'x'; } }), cursor:{ fill:'rgba(255,255,255,.04)' } }),
          h(ReferenceLine, { x:1, stroke:C.inkSoft, strokeDasharray:'3 3', label:{ value:'balanced', position:'top', fill:C.inkSoft, fontSize:10 } }),
          h(Bar, { dataKey:'exec_ratio', name:'Content-to-strategy ratio', radius:[0,4,4,0] },
            rows.map(function(r,i){ return h(Cell, { key:i, fill:r.exec_ratio>=1 ? C.eastern : C.western }); }),
            h(LabelList, { dataKey:'exec_ratio', position:'right', fontSize:13, fill:C.inkSoft, formatter:function(v){ return v.toFixed(2); } }))
        ))));
}

// ===== 3. Marketing work mix (per country, selectable) =====
function MixSection(props){
  props = props || {};
  const [sel, setSel] = useState(props.defaultSel || 'FRA');
  const cmpPair = useState(props.defaultCompare || null);
  const cmpSel = cmpPair[0] === sel ? null : cmpPair[0], setCmp = cmpPair[1];
  const country = D.find(function(c){ return c.code===sel; });
  const cm = cmpSel ? D.find(function(c){ return c.code===cmpSel; }) : null;
  const specs = [
    { label:'Marketing / social content', key:'content', color:C.eastern },
    { label:'Email & messaging', key:'email', color:C.western },
    { label:'Plan & strategy', key:'strategy', color:C.amber || C.southern },
    { label:'Creative writing', key:'creative', color:C.nordic },
    { label:'Presentations & slides', key:'slides', color:'#9b8cff' },
    { label:'Images & graphics', key:'image', color:'#f5c542' }
  ];
  const mix = specs.map(function(s){
    return { label:s.label, color:s.color, val:country[s.key], cmp:cm ? cm[s.key] : null };
  }).filter(function(m){ return m.val!=null; }).sort(function(a,b){ return b.val-a.val; });

  return h('section', { className:'block', id:'mix' },
    h('p', { className:'eyebrow' }, '03 \u00B7 The marketing work mix'),
    h('h2', null, 'What AI-assisted marketing actually produces'),
    h('p', { className:'sub' }, 'For any market, the breakdown of marketing-relevant output types. Pick a country to see how its mix of content, email, strategy, creative writing, decks and graphics compares, and set a second country to overlay head-to-head. Most marketing work across Europe is email and written content, with strategy close behind.'),
    h('div', { className:'selrow' },
      D.slice().sort(function(a,b){ return a.name.localeCompare(b.name); }).map(function(r){
        return h('span', { key:r.code, className:'chip', 'data-on':sel===r.code?'1':'0',
          title:r.name, onClick:function(){ setSel(r.code); } },
          h(Flag, { code:r.code, size:15 }), h('span', { className:'chip-code' }, r.code));
      })),
    h('div', { style:{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:'.35rem', margin:'.65rem 0 1rem' } },
      h('span', { style:{ fontFamily:'IBM Plex Mono, ui-monospace, monospace', fontSize:'.62rem', letterSpacing:'.08em', textTransform:'uppercase', color:C.inkSoft, marginRight:'.2rem' } }, 'Compare with'),
      h('button', { onClick:function(){ setCmp(null); }, 'aria-pressed':!cm,
        style:{ fontFamily:'IBM Plex Mono, ui-monospace, monospace', fontSize:'.62rem', padding:'3px 8px', borderRadius:7, cursor:'pointer',
          border:'1px solid '+(!cm ? '#e6e9f5' : 'rgba(230,233,245,.25)'),
          background:!cm ? '#e6e9f5' : 'transparent', color:!cm ? '#10152b' : C.inkSoft } }, 'OFF'),
      D.slice().sort(function(a,b){ return a.name.localeCompare(b.name); })
        .filter(function(a){ return a.code!==sel; })
        .map(function(a){
          var on = cmpSel===a.code;
          return h('button', { key:a.code, title:a.name, 'aria-label':'Compare with '+a.name, 'aria-pressed':on,
            onClick:function(){ setCmp(on ? null : a.code); },
            style:{ padding:2, borderRadius:'50%', cursor:'pointer', lineHeight:0, background:'transparent',
              border:'2px solid '+(on ? CLUST_COLOR[a.cluster] : 'transparent'), opacity:on?1:.6 } },
            h(Flag, { code:a.code, size:14 }));
        })),
    h('div', { className:'card' },
      h('div', { style:{ display:'flex', alignItems:'center', gap:'.6em', marginBottom:'1rem', flexWrap:'wrap' } },
        h(Flag, { code:country.code, size:24 }),
        h('span', { style:{ fontFamily:'Space Grotesk, system-ui, sans-serif', fontWeight:600, fontSize:'1.1rem' } }, country.name),
        cm && h('span', { style:{ color:C.inkSoft, fontSize:'.85rem' } }, 'vs'),
        cm && h(Flag, { code:cm.code, size:20 }),
        cm && h('span', { style:{ fontFamily:'Space Grotesk, system-ui, sans-serif', fontWeight:600, fontSize:'1rem', color:C.inkSoft } }, cm.name)),
      h(ResponsiveContainer, { width:'100%', height:mix.length*(cm?58:40)+20 },
        h(BarChart, { data:mix, layout:'vertical', margin:{ left:8, right:44, top:0, bottom:0 } },
          h(XAxis, { type:'number', tickLine:false, axisLine:false, tickFormatter:function(v){ return v+'%'; } }),
          h(YAxis, { type:'category', dataKey:'label', width:158, tickLine:false, axisLine:false, tick:{ fontSize:12.5 } }),
          h(Tooltip, { content:h(TT, { fmt:function(v){ return v.toFixed(2)+'%'; } }), cursor:{ fill:'rgba(255,255,255,.04)' } }),
          h(Bar, { dataKey:'val', name:cm ? country.name : 'Share of usage', radius:[0,4,4,0] },
            mix.map(function(m,i){ return h(Cell, { key:i, fill:m.color }); }),
            h(LabelList, { dataKey:'val', position:'right', fontSize:13, fill:C.inkSoft, formatter:function(v){ return v.toFixed(1)+'%'; } })),
          cm && h(Bar, { dataKey:'cmp', name:cm.name, radius:[0,4,4,0],
            fill:'rgba(230,233,245,.16)', stroke:'rgba(230,233,245,.7)', strokeWidth:1.2 },
            h(LabelList, { dataKey:'cmp', position:'right', fontSize:12, fill:C.inkSoft, formatter:function(v){ return v==null ? '' : v.toFixed(1)+'%'; } }))
        ))));
}

function Hero(){
  const byContent = D.slice().sort(function(a,b){ return b.content-a.content; });
  const topC = byContent[0];
  const byRatio = D.slice().sort(function(a,b){ return b.exec_ratio-a.exec_ratio; });
  const byAdopt = D.slice().sort(function(a,b){ return b.usage_index-a.usage_index; });
  const topA = byAdopt[0];
  return h('div', { className:'hero' },
    h('p', { className:'eyebrow' }, 'Anthropic Economic Index \u00b7 May 2026'),
    h('h1', null, 'How ', h('span', { className:'grad' }, 'Europe'), ' markets with Claude'),
    h('p', { className:'lede' }, 'Thirty-three markets through a marketing lens: where AI-assisted marketing content gets made, whether teams use it to execute or to plan, and what that work actually looks like.'),
    h('div', { className:'statrow' },
      h('div', { className:'stat' }, h('div', { className:'n', style:{ color:C.eastern } }, topC.content.toFixed(1)+'%'), h('div', { className:'l' }, topC.name+' makes the most marketing content')),
      h('div', { className:'stat' }, h('div', { className:'n', style:{ color:C.western } }, byRatio[byRatio.length-1].exec_ratio.toFixed(2)+'x'), h('div', { className:'l' }, byRatio[byRatio.length-1].name+' is the most strategy-led')),
      h('div', { className:'stat' }, h('div', { className:'n', style:{ color:C.nordic } }, '33'), h('div', { className:'l' }, 'European markets analysed')),
      h('div', { className:'stat' }, h('div', { className:'n', style:{ color:C.southern } }, topA.usage_index.toFixed(1)+'x'), h('div', { className:'l' }, topA.name+' has the deepest adoption per capita'))
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
