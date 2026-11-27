/* =============================================================================
 * How Europe markets with Claude: 33 markets, Anthropic Economic Index (May 2026)
 * Stack: React 18 + Recharts + D3 + topojson, all vendored (no CDN at runtime).
 * No JSX: h() alias for React.createElement, same convention as the APAC view.
 * Visual tokens match stephanewith.com (see /assets/dash/shell.css).
 * ========================================================================== */
const { useState, useMemo } = React;
const { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip, ReferenceLine, LabelList,
        ScatterChart, Scatter, CartesianGrid, ZAxis } = Recharts;
const h = React.createElement;

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const SANS = "'Space Grotesk', system-ui, sans-serif";

/* Region colours are used for region only. The execution/strategy ratio has its
   own diverging scale (cyan = strategy-led, violet = execution-led). */
const C = {
  western:'#7c95ff', nordic:'#3ee0b0', southern:'#f5b545', eastern:'#ff6fa8',
  cyan:'#38e8ff', violet:'#c15bff', ink:'#f4f6ff', inkSoft:'#9aa2bf',
  line:'rgba(255,255,255,.10)', panel:'#0d1018', mid:'#2a2f40'
};
const CLUST_COLOR = { 'Western':C.western, 'Nordic':C.nordic, 'Southern':C.southern, 'Central/Eastern':C.eastern };
const D = AEI_DATA.countries;
const G = AEI_DATA.meta.global || { auto:48.62, aug:51.38 };
const BY_NAME = D.slice().sort(function(a,b){ return a.name.localeCompare(b.name); });

/* one diverging scale for the content-to-strategy ratio, shared by map + bars */
const RATIO_DOMAIN = [0.27, 1, 1.25];
const ratioColor = (typeof d3 !== 'undefined')
  ? d3.scaleDiverging(d3.interpolateRgbBasis([C.cyan, '#8a90a8', C.violet])).domain(RATIO_DOMAIN)
  : function(v){ return v >= 1 ? C.violet : C.cyan; };

function isNarrow(){ return window.matchMedia && window.matchMedia('(max-width: 640px)').matches; }

let flagSeq = 0;
function Flag(props){
  const size = props.size || 20;
  // every flag gets its own clipPath id (the shared FLAGS markup uses id="c")
  const uid = React.useMemo(function(){ return 'fc' + (++flagSeq); }, []);
  const svg = (FLAGS[props.code]||'').replace('id="c"', 'id="'+uid+'"').replace('url(#c)', 'url(#'+uid+')');
  return h('span', { className:'flag', 'aria-hidden':true, style:{ width:size, height:size },
    dangerouslySetInnerHTML:{ __html:'<svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'">'+svg+'</svg>' } });
}

function TT(props){
  if (!props.active || !props.payload || !props.payload.length) return null;
  const fmt = props.fmt;
  return h('div', { className:'tt' },
    h('div', { style:{ fontWeight:600, marginBottom:4 } }, props.payload[0].payload.name),
    props.payload.map(function(p, i){
      return h('div', { key:i, style:{ color:C.inkSoft } }, p.name+': ', h('b', { style:{ color:C.ink } }, fmt ? fmt(p.value) : p.value));
    }));
}

function regionLegend(title){
  return h('div', { className:'legend legend--keyed' },
    h('span', { className:'legend-title' }, title || 'Colour = region'),
    Object.keys(CLUST_COLOR).map(function(k){
      return h('b', { key:k }, h('span', { className:'sw', style:{ background:CLUST_COLOR[k] } }), k);
    }));
}

function ratioLegend(){
  return h('div', { className:'ratiolegend', 'aria-hidden':true },
    h('span', null, 'Strategy-led'),
    h('span', { className:'ratiobar' }),
    h('span', null, 'Execution-led'),
    h('span', { className:'ratiomid' }, '1.0 = balanced'));
}

// ===== 1. Marketing content output =====
function ContentSection(){
  const rows = useMemo(function(){ return D.slice().sort(function(a,b){ return b.content-a.content; }); }, []);
  const max = Math.ceil(rows[0].content);
  return h('section', { className:'block', id:'content' },
    h('p', { className:'eyebrow' }, '01 · Marketing content output'),
    h('h2', null, 'Where marketing content gets made'),
    h('p', { className:'sub' }, 'Share of each market’s Claude conversations whose main output is marketing or social content. These are small slices of total usage, so the relative lean is what matters: Ukraine, Cyprus and Malta produce the most marketing content, the Nordics and Luxembourg the least. Most markets softened slightly in May; Cyprus rose 1.0pt in a single month.'),
    regionLegend('Bar colour = region'),
    h('p', { className:'note' }, '▲ / ▼ = change in share vs April 2026, in percentage points'),
    h('div', { className:'card' },
      h(ResponsiveContainer, { width:'100%', height:rows.length*28+30 },
        h(BarChart, { data:rows, layout:'vertical', margin:{ left:8, right:88, top:0, bottom:0 } },
          h(XAxis, { type:'number', domain:[0,max], tickLine:false, axisLine:false, tickFormatter:function(v){ return v+'%'; } }),
          h(YAxis, { type:'category', dataKey:'name', width:118, interval:0, tickLine:false, axisLine:false, tick:{ fontSize:12.5 } }),
          h(Tooltip, { content:h(TT, { fmt:function(v){ return v.toFixed(2)+'%'; } }), cursor:{ fill:'rgba(255,255,255,.04)' } }),
          h(Bar, { dataKey:'content', name:'Marketing content share', radius:[0,4,4,0] },
            rows.map(function(r,i){ return h(Cell, { key:i, fill:CLUST_COLOR[r.cluster] }); }),
            h(LabelList, { dataKey:'content', content:function(p){
              var r = rows[p.index]; if (!r) return null;
              var d = r.content_apr != null ? r.content - r.content_apr : null;
              var show = d != null && Math.abs(d) >= 0.1;
              var up = d != null && d > 0;
              return h('g', null,
                h('text', { x:p.x + p.width + 6, y:p.y + p.height/2, dominantBaseline:'central',
                  fontSize:13, fontFamily:MONO, fill:C.ink }, r.content.toFixed(1)+'%'),
                show ? h('text', { x:p.x + p.width + 54, y:p.y + p.height/2, dominantBaseline:'central',
                  fontSize:12, fontFamily:MONO, fill: up ? C.ink : C.inkSoft },
                  (up ? '▲' : '▼') + Math.abs(d).toFixed(1)) : null);
            } }))
        ))));
}

// ===== Europe choropleth (section 2) =====
const TOPO_URL = 'vendor/countries-110m.json';
const ISO_BY_CODE = {
  FRA:'250', GBR:'826', DEU:'276', ESP:'724', ITA:'380', NLD:'528', POL:'616',
  CHE:'756', BEL:'056', PRT:'620', UKR:'804', SWE:'752', ROU:'642', AUT:'040',
  NOR:'578', DNK:'208', CZE:'203', IRL:'372', GRC:'300', FIN:'246', HUN:'348',
  SRB:'688', BGR:'100', SVK:'703', HRV:'191', LTU:'440', SVN:'705', CYP:'196',
  EST:'233', LVA:'428', LUX:'442', MLT:'470', ISL:'352'
};
// Small-area markets get clickable inset dots [lon,lat] so they stay usable.
const INSET = { LUX:[6.1,49.8], MLT:[14.4,35.9], CYP:[33.0,35.05] };

function EuroMap(){
  const [sel, setSel] = useState('FRA');
  const hostRef = React.useRef(null);
  const detailRef = React.useRef(null);
  const selRef = React.useRef(sel);
  const [status, setStatus] = React.useState('loading');
  selRef.current = sel;

  const choose = function(code){
    setSel(code);
    if (isNarrow() && detailRef.current) detailRef.current.scrollIntoView({ behavior:'smooth', block:'nearest' });
  };
  const chooseRef = React.useRef(choose); chooseRef.current = choose;

  const byIso = useMemo(function(){
    const m = {};
    D.forEach(function(c){ if (ISO_BY_CODE[c.code]) m[ISO_BY_CODE[c.code]] = c; });
    return m;
  }, []);
  const country = D.find(function(c){ return c.code === sel; });

  React.useEffect(function(){
    if (typeof d3 === 'undefined' || typeof topojson === 'undefined'){ setStatus('error'); return; }
    const host = hostRef.current; if (!host) return;
    const inner = document.createElement('div');
    host.appendChild(inner);

    const noData = 'rgba(255,255,255,.06)', stroke = '#05060a', W = 420, Ht = 500;
    const svg = d3.select(inner).append('svg')
      .attr('viewBox', '0 0 ' + W + ' ' + Ht).attr('width', '100%')
      .attr('role', 'group').attr('aria-label', 'Map of Europe shaded by the content-to-strategy ratio. Use Tab to move between countries, Enter to select.');
    const proj = d3.geoConicConformal().rotate([-12,0]).center([9,52]).scale(540).translate([W/2 + 40, Ht/2 + 20]);
    const path = d3.geoPath(proj);

    function applyHighlight(){
      svg.selectAll('[data-code]').each(function(){
        const on = this.getAttribute('data-code') === selRef.current;
        const dot = this.tagName === 'circle';
        this.setAttribute('stroke', on ? '#ffffff' : (dot ? '#f4f6ff' : stroke));
        this.setAttribute('stroke-width', on ? 2.2 : (dot ? 1.2 : 0.6));
      });
    }
    svg.node().__applyHighlight = applyHighlight;
    function keyPick(e, code){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); chooseRef.current(code); } }

    d3.json(TOPO_URL).then(function(topo){
      const key = topo.objects.countries ? 'countries' : Object.keys(topo.objects)[0];
      const feats = topojson.feature(topo, topo.objects[key]).features;
      svg.append('g').selectAll('path').data(feats).join('path')
        .attr('d', path)
        .attr('fill', function(f){ const c = byIso[f.id]; return c ? ratioColor(c.exec_ratio) : noData; })
        .attr('stroke', stroke).attr('stroke-width', 0.6)
        .attr('data-code', function(f){ return byIso[f.id] ? byIso[f.id].code : null; })
        .attr('class', function(f){ return byIso[f.id] ? 'mapc' : null; })
        .attr('tabindex', function(f){ return byIso[f.id] && !INSET[byIso[f.id].code] ? 0 : null; })
        .attr('role', function(f){ return byIso[f.id] ? 'button' : null; })
        .attr('aria-label', function(f){ const c = byIso[f.id]; return c ? c.name + ', ratio ' + c.exec_ratio.toFixed(2) : null; })
        .style('cursor', function(f){ return byIso[f.id] ? 'pointer' : 'default'; })
        .on('click', function(e,f){ if (byIso[f.id]) chooseRef.current(byIso[f.id].code); })
        .on('keydown', function(e,f){ if (byIso[f.id]) keyPick(e, byIso[f.id].code); })
        .append('title').text(function(f){ const c = byIso[f.id]; return c ? c.name + ': ' + c.exec_ratio.toFixed(2) + '×' : ''; });
      const g2 = svg.append('g');
      Object.keys(INSET).forEach(function(code){
        const c = D.find(function(x){ return x.code === code; }); if (!c) return;
        const xy = proj(INSET[code]); if (!xy) return;
        const gd = g2.append('g').attr('class','mapc').style('cursor','pointer').attr('tabindex',0).attr('role','button')
          .attr('aria-label', c.name + ', ratio ' + c.exec_ratio.toFixed(2))
          .on('click', function(){ chooseRef.current(code); })
          .on('keydown', function(e){ keyPick(e, code); });
        gd.append('title').text(c.name + ': ' + c.exec_ratio.toFixed(2) + '×');
        gd.append('circle').attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 7)
          .attr('fill', ratioColor(c.exec_ratio)).attr('stroke', '#f4f6ff').attr('stroke-width', 1.2)
          .attr('data-code', code);
        var lx = code === 'CYP' ? xy[0] - 11 : xy[0] + 11;
        gd.append('text').attr('x', lx).attr('text-anchor', code === 'CYP' ? 'end' : 'start').attr('y', xy[1])
          .attr('dominant-baseline', 'central').attr('fill', '#f4f6ff')
          .attr('font-size', 12).attr('font-family', MONO)
          .attr('pointer-events', 'none').text(code);
      });
      applyHighlight();
      setStatus('ready');
    }).catch(function(){ setStatus('error'); });

    return function(){ if (inner.parentNode === host) host.removeChild(inner); };
  }, [byIso]);

  React.useEffect(function(){
    const host = hostRef.current; if (!host) return;
    const svg = host.querySelector('svg'); if (!svg) return;
    if (svg.__applyHighlight) svg.__applyHighlight();
  }, [sel, status]);

  return h('div', { className:'mapwrap' },
    h('div', { className:'mapgrid' },
      h('div', { className:'mapcanvas' },
        h('div', { ref:hostRef, style:{ width:'100%' } }),
        status === 'loading' ? h('p', { className:'maphint' }, 'Loading map…') : null,
        status === 'error' ? h('p', { className:'maphint' }, 'Map unavailable; the ranked chart below shows the same data.') : null),
      h('div', { className:'mapdetail', ref:detailRef, 'aria-live':'polite' },
        h('p', { className:'mapdlabel' }, 'Selected market'),
        h('div', { style:{ display:'flex', alignItems:'center', gap:'.5em', margin:'0 0 .3rem' } },
          h(Flag, { code:country.code, size:22 }),
          h('span', { style:{ fontFamily:SANS, fontWeight:600, fontSize:'1.15rem' } }, country.name)),
        h('p', { className:'mapdratio', style:{ color: ratioColor(country.exec_ratio) === C.mid ? C.ink : undefined } },
          h('span', { className:'ratiodot', style:{ background:ratioColor(country.exec_ratio) } }),
          country.exec_ratio.toFixed(2) + '×'),
        h('p', { className:'mapdsub' }, country.exec_ratio >= 1 ? 'execution-led: more content made than planned' : 'strategy-led: more planning than content'),
        h('div', { className:'mapdrows' },
          h('div', { className:'mapdrow' }, h('span', null, 'Marketing content'), h('b', null, country.content.toFixed(2)+'%')),
          h('div', { className:'mapdrow' }, h('span', null, 'Plan & strategy'), h('b', null, country.strategy.toFixed(2)+'%'))),
        h('p', { className:'mapdnote' }, 'Tap or click any country. Luxembourg, Malta and Cyprus are the labelled dots.'))));
}

// ===== 2. Execution vs strategy =====
function RatioSection(){
  const rows = useMemo(function(){ return D.slice().sort(function(a,b){ return b.exec_ratio-a.exec_ratio; }); }, []);
  const [all, setAll] = useState(false);
  const shown = all ? rows : rows.slice(0,5).concat([null]).concat(rows.slice(-5));
  return h('section', { className:'block', id:'ratio' },
    h('p', { className:'eyebrow' }, '02 · Execution vs strategy'),
    h('h2', null, 'Making content, or planning it?'),
    h('p', { className:'sub' }, 'The ratio of marketing-content output to strategy-and-planning output. Above 1.0, a market uses Claude more to make marketing content than to plan it; below 1.0, the reverse. Ukraine and Malta are the most execution-led. Iceland, Luxembourg and Norway lean hardest to strategy, planning three to four times more than they produce.'),
    ratioLegend(),
    h('div', { className:'card', style:{ marginBottom:'1rem' } }, h(EuroMap)),
    h('div', { className:'card' },
      h('div', { className:'rankhead' },
        h('span', { className:'legend-title' }, all ? 'All 33 markets' : 'Most execution-led and most strategy-led'),
        h('button', { className:'textbtn', onClick:function(){ setAll(!all); }, 'aria-expanded':all }, all ? 'Show top and bottom 5' : 'Show all 33')),
      h('div', { className:'ratiorows', role:'list' },
        shown.map(function(r, i){
          if (!r) return h('div', { key:'gap', className:'ratiogap', 'aria-hidden':true }, '…');
          var x = Math.min(r.exec_ratio, 1.4) / 1.4 * 100;
          return h('div', { key:r.code, className:'ratiorow', role:'listitem' },
            h('span', { className:'rl' }, h(Flag, { code:r.code, size:14 }), r.name),
            h('span', { className:'rt' },
              h('span', { className:'rbar', style:{ width:x+'%', background:ratioColor(r.exec_ratio) } }),
              h('span', { className:'rone', style:{ left:(1/1.4*100)+'%' } })),
            h('span', { className:'rv' }, r.exec_ratio.toFixed(2)+'×'));
        })),
      h('p', { className:'note', style:{ margin:'.8rem 0 0' } }, 'Dashed line = 1.0, balanced. Scale runs 0 to 1.4×.')));
}

// ===== 3. Marketing work mix (per country, selectable) =====
function MixSection(){
  const [sel, setSel] = useState('FRA');
  const [cmpRaw, setCmp] = useState('');
  const cmpSel = cmpRaw === sel ? '' : cmpRaw;
  const country = D.find(function(c){ return c.code===sel; });
  const cm = cmpSel ? D.find(function(c){ return c.code===cmpSel; }) : null;
  const specs = [
    { label:'Marketing / social content', key:'content' },
    { label:'Email & messaging', key:'email' },
    { label:'Plan & strategy', key:'strategy' },
    { label:'Creative writing', key:'creative' },
    { label:'Presentations & slides', key:'slides' },
    { label:'Images & graphics', key:'image' }
  ];
  const mix = specs.map(function(s){
    return { label:s.label, name:s.label, val:country[s.key], cmp:cm ? cm[s.key] : null };
  }).filter(function(m){ return m.val!=null; }).sort(function(a,b){ return b.val-a.val; });
  const opts = function(skip){
    return BY_NAME.filter(function(c){ return c.code !== skip; }).map(function(c){
      return h('option', { key:c.code, value:c.code }, c.name);
    });
  };

  return h('section', { className:'block', id:'mix' },
    h('p', { className:'eyebrow' }, '03 · The marketing work mix'),
    h('h2', null, 'What AI-assisted marketing actually produces'),
    h('p', { className:'sub' }, 'For any market, the breakdown of marketing-relevant output types. Pick a market, then optionally a second one to compare head-to-head. Across Europe, most marketing work is email and written content, with strategy close behind.'),
    h('div', { className:'pickers' },
      h('label', { className:'picker' },
        h('span', null, 'Market'),
        h('span', { className:'selectwrap' }, h(Flag, { code:sel, size:18 }),
          h('select', { value:sel, onChange:function(e){ setSel(e.target.value); } }, opts(null)))),
      h('label', { className:'picker' },
        h('span', null, 'Compare with'),
        h('span', { className:'selectwrap' }, cm ? h(Flag, { code:cm.code, size:18 }) : h('span', { className:'flagph' }),
          h('select', { value:cmpSel, onChange:function(e){ setCmp(e.target.value); } },
            h('option', { value:'' }, 'No comparison'), opts(sel))))),
    h('div', { className:'card' },
      cm && h('div', { className:'mixkey' },
        h('b', null, h('span', { className:'sw', style:{ background:C.cyan } }), country.name),
        h('b', null, h('span', { className:'sw sw--outline' }), cm.name)),
      h(ResponsiveContainer, { width:'100%', height:mix.length*(cm?58:42)+20 },
        h(BarChart, { data:mix, layout:'vertical', margin:{ left:8, right:52, top:0, bottom:0 } },
          h(XAxis, { type:'number', tickLine:false, axisLine:false, tickFormatter:function(v){ return v+'%'; } }),
          h(YAxis, { type:'category', dataKey:'label', width:isNarrow() ? 112 : 170, interval:0, tickLine:false, axisLine:false, tick:{ fontSize:12.5 } }),
          h(Tooltip, { content:h(TT, { fmt:function(v){ return v == null ? 'n/a' : v.toFixed(2)+'%'; } }), cursor:{ fill:'rgba(255,255,255,.04)' } }),
          h(Bar, { dataKey:'val', name:country.name, radius:[0,4,4,0], fill:C.cyan },
            h(LabelList, { dataKey:'val', position:'right', fontSize:13, fill:C.ink, fontFamily:MONO, formatter:function(v){ return v.toFixed(1)+'%'; } })),
          cm && h(Bar, { dataKey:'cmp', name:cm.name, radius:[0,4,4,0],
            fill:'rgba(244,246,255,.10)', stroke:'rgba(244,246,255,.75)', strokeWidth:1.2 },
            h(LabelList, { dataKey:'cmp', position:'right', fontSize:12, fill:C.inkSoft, fontFamily:MONO, formatter:function(v){ return v==null ? '' : v.toFixed(1)+'%'; } }))
        ))));
}

// ===== 4. Adoption, code and automation =====
const LABEL_CODES = ['CHE','LUX','NOR','SRB','UKR','BGR','GBR','IRL','DEU','FRA','SVN','POL'];
function ScatterDot(props){
  const p = props.payload, cx = props.cx, cy = props.cy;
  if (cx == null || cy == null) return null;
  const lab = LABEL_CODES.indexOf(p.code) >= 0;
  return h('g', null,
    h('circle', { cx:cx, cy:cy, r:7, fill:CLUST_COLOR[p.cluster], fillOpacity:.9, stroke:'#05060a', strokeWidth:1.5 }),
    lab ? h('text', { x:cx + 10, y:cy + 4, fontSize:11, fontFamily:MONO, fill:C.inkSoft }, p.code) : null);
}

function AutoStrip(){
  const lo = 40, hi = 51;
  const pos = function(v){ return (v - lo) / (hi - lo) * 100; };
  const rows = D.slice().sort(function(a,b){ return a.auto - b.auto; });
  const minR = rows[0], maxR = rows[rows.length-1];
  const above = rows.filter(function(r){ return r.auto > G.auto; });
  return h('div', { className:'strip' },
    h('div', { className:'stripaxis' },
      h('span', null, '◂ keeps AI in the loop'),
      h('span', null, 'hands work off ▸')),
    h('div', { className:'striptrack' },
      h('span', { className:'stripglobal', style:{ left:pos(G.auto)+'%' } }, h('em', null, 'global ' + G.auto.toFixed(1) + '%')),
      rows.map(function(r){
        return h('span', { key:r.code, className:'stripdot', title:r.name + ': ' + r.auto.toFixed(1) + '% automation',
          style:{ left:pos(r.auto)+'%', background:CLUST_COLOR[r.cluster] } });
      }),
      [minR, maxR].map(function(r, i){
        return h('span', { key:'l'+i, className:'striplabel', style:{ left:pos(r.auto)+'%', transform: i ? 'translateX(-100%)' : 'none' } },
          r.name + ' ' + r.auto.toFixed(1) + '%');
      })),
    h('div', { className:'stripticks' }, [40,42,44,46,48,50].map(function(t){
      return h('span', { key:t, style:{ left:pos(t)+'%' } }, t + '%');
    })),
    h('p', { className:'note', style:{ marginTop:'1.6rem' } },
      'Share of conversations where people hand the task to Claude (automation) rather than work through it together (augmentation). Only ' + above.length + ' of 33 European markets sit above the global ' + G.auto.toFixed(1) + '%: ' +
      above.map(function(r){ return r.name; }).join(', ') + '.'));
}

function AdoptionSection(){
  const top = D.slice().sort(function(a,b){ return b.usage_index - a.usage_index; });
  const sw = D.slice().sort(function(a,b){ return b.software - a.software; });
  const narrow = isNarrow();
  return h('section', { className:'block', id:'adoption' },
    h('p', { className:'eyebrow' }, '04 · Adoption, code and automation'),
    h('h2', null, 'The deeper the adoption, the less of it is code'),
    h('p', { className:'sub' },
      top[0].name + ' leads Europe on adoption at ' + top[0].usage_index.toFixed(1) + '× its working-age population share, with ' + top[1].name + ' and ' + top[2].name + ' close behind. ' +
      'Markets with deeper adoption spend a smaller share of their Claude conversations on software development: ' + sw[0].name + ' (' + sw[0].software.toFixed(1) + '%) and ' + sw[1].name + ' (' + sw[1].software.toFixed(1) + '%) lead on code, while the highest-adoption markets sit nearer 9%. This is a pattern across markets, not evidence of a cause.'),
    regionLegend('Dot colour = region'),
    h('div', { className:'card' },
      h('p', { className:'cardtitle' }, 'Adoption index vs software development share · May 2026'),
      h(ResponsiveContainer, { width:'100%', height: narrow ? 340 : 420 },
        h(ScatterChart, { margin:{ left:0, right:24, top:10, bottom:24 } },
          h(CartesianGrid, { stroke:'rgba(255,255,255,.06)' }),
          h(XAxis, { type:'number', dataKey:'usage_index', name:'Adoption index', scale:'log', domain:[0.7, 5.5], ticks:[1,2,3,4,5],
            tickLine:false, axisLine:{ stroke:C.line }, tickFormatter:function(v){ return v+'×'; },
            label:{ value:'Adoption index (log scale)', position:'bottom', offset:8, fill:C.inkSoft, fontSize:12, fontFamily:MONO } }),
          h(YAxis, { type:'number', dataKey:'software', name:'Software development', domain:[6, 17], ticks:[7,9,11,13,15,17], width:44,
            tickLine:false, axisLine:{ stroke:C.line }, tickFormatter:function(v){ return v+'%'; } }),
          h(ZAxis, { range:[60,60] }),
          h(ReferenceLine, { x:1, stroke:C.inkSoft, strokeDasharray:'3 3', label:{ value:'1× = parity', position:'insideTopLeft', fill:C.inkSoft, fontSize:12 } }),
          h(Tooltip, { cursor:{ stroke:C.line },
            content:function(p){
              if (!p.active || !p.payload || !p.payload.length) return null;
              var r = p.payload[0].payload;
              return h('div', { className:'tt' },
                h('div', { style:{ fontWeight:600, marginBottom:4 } }, r.name),
                h('div', { style:{ color:C.inkSoft } }, 'Adoption index: ', h('b', { style:{ color:C.ink } }, r.usage_index.toFixed(2)+'×')),
                h('div', { style:{ color:C.inkSoft } }, 'Software development: ', h('b', { style:{ color:C.ink } }, r.software.toFixed(1)+'%')),
                h('div', { style:{ color:C.inkSoft } }, 'Automation share: ', h('b', { style:{ color:C.ink } }, r.auto.toFixed(1)+'%')));
            } }),
          h(Scatter, { data:D, shape:ScatterDot, isAnimationActive:false })))),
    h('div', { className:'card', style:{ marginTop:'1rem' } },
      h('p', { className:'cardtitle' }, 'Automation vs augmentation · every market on one line'),
      h(AutoStrip)));
}

function Hero(){
  const byContent = D.slice().sort(function(a,b){ return b.content-a.content; });
  const topC = byContent[0];
  const byRatio = D.slice().sort(function(a,b){ return b.exec_ratio-a.exec_ratio; });
  const byAdopt = D.slice().sort(function(a,b){ return b.usage_index-a.usage_index; });
  const bySw = D.slice().sort(function(a,b){ return b.software-a.software; });
  const topA = byAdopt[0];
  const stat = function(n, l, href){
    return h('a', { className:'stat', href:href }, h('div', { className:'n' }, n), h('div', { className:'l' }, l));
  };
  return h('div', { className:'hero' },
    h('p', { className:'eyebrow' }, 'Anthropic Economic Index · May 2026 · 33 markets'),
    h('h1', null, 'How ', h('span', { className:'grad' }, 'Europe'), ' markets with Claude'),
    h('p', { className:'lede' }, 'Where AI-assisted marketing content gets made, whether teams use AI to execute or to plan, what that work looks like, and how adoption, coding and automation line up across thirty-three markets.'),
    h('div', { className:'statrow' },
      stat(topC.content.toFixed(1)+'%', topC.name+' makes the most marketing content', '#content'),
      stat(byRatio[byRatio.length-1].exec_ratio.toFixed(2)+'×', byRatio[byRatio.length-1].name+' is the most strategy-led', '#ratio'),
      stat(topA.usage_index.toFixed(1)+'×', topA.name+' has the deepest adoption per person', '#adoption'),
      stat(bySw[0].software.toFixed(1)+'%', 'of '+bySw[0].name+'’s conversations are software development, Europe’s high', '#adoption')
    ));
}

function App(){
  return h('div', { className:'wrap' },
    h(Hero),
    h(ContentSection),
    h(RatioSection),
    h(MixSection),
    h(AdoptionSection),
    h('div', { className:'footer' },
      h('div', { className:'endcta' },
        h('p', null, 'Want the story behind the numbers?'),
        h('a', { href:'/writing/ai-marketing-europe/', className:'ctabtn' }, 'Read the three findings →'),
        h('a', { href:'/apac-ai-marketing-dash/', className:'ctabtn ctabtn--ghost' }, 'See the APAC view')),
      h('p', null, 'Source: ', h('a', { href:'https://www.anthropic.com/economic-index', target:'_blank', rel:'noopener' }, 'Anthropic Economic Index'), ', release 2026-06-26, May 2026 data, CC BY 4.0. All figures are shares of each market’s Claude.ai and Cowork conversations (Free, Pro and Max), across all 33 European markets in the dataset. Output and topic categories are inferred from conversation content. Adoption index = a market’s share of Claude usage divided by its share of working-age population (1.0 = parity). These figures describe observed Claude usage, not jobs or the labour market.'),
      h('p', { style:{ marginTop:'.6rem' } }, 'Built by ', h('a', { href:'/' }, 'Stef With'), ' · stephanewith.com'))
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
