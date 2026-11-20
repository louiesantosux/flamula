/* Flâmula · dados históricos das bandeiras.
   Adoção, designer, contexto e linha do tempo vêm da Wikidata e da Wikipédia (CC BY-SA),
   consultadas no navegador e guardadas em cache por 7 dias. */
(() => {
const TTL = 7 * 864e5, VER = 'v4';
const cacheGet = k => { try { const v = JSON.parse(localStorage.getItem(`fl-w-${VER}-${k}`) || 'null'); if (v && Date.now() - v.t < TTL) return v.d } catch (e) { } return null };
const cacheSet = (k, d) => { try { localStorage.setItem(`fl-w-${VER}-${k}`, JSON.stringify({ t: Date.now(), d })) } catch (e) { } };
const tfetch = (u, ms = 10000) => { const c = new AbortController(); const t = setTimeout(() => c.abort(), ms); return fetch(u, { signal: c.signal }).finally(() => clearTimeout(t)) };
const sparql = async q => { const r = await tfetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(q)); if (!r.ok) throw new Error('Wikidata ' + r.status); return (await r.json()).results.bindings };
const val = (b, k) => b[k] && b[k].value;
const qid = u => u ? u.split('/').pop() : null;
const year = s => { if (!s) return null; const m = /^([+-]?\d{1,4})-/.exec(s); return m ? parseInt(m[1], 10) : null };
const https = u => u ? u.replace(/^http:/, 'https:') : null;
const thumb = (u, w = 360) => u ? https(u) + (u.includes('?') ? '&' : '?') + 'width=' + w : null;
const isQ = s => /^Q\d+$/.test(s || '');
const LBL = 'SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,pt-br,en". }';

const summary = async (lang, title) => {
  if (!title) return null;
  try {
    const r = await tfetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`);
    if (!r.ok) return null; const j = await r.json();
    return j.extract ? { text: j.extract, url: j.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`, lang } : null;
  } catch (e) { return null }
};
const titleOf = u => u ? decodeURIComponent(u.split('/wiki/')[1] || '').replace(/_/g, ' ') : null;

/* informações do item da bandeira (QID) */
const flagItem = async q => {
  const rows = await sparql(`SELECT ?label ?des ?desLabel ?inc ?img ?artPt ?artEn WHERE {
    BIND(wd:${q} AS ?f)
    OPTIONAL { ?f wdt:P287 ?des } OPTIONAL { ?f wdt:P571 ?inc } OPTIONAL { ?f wdt:P18 ?img }
    OPTIONAL { ?artPt schema:about ?f; schema:isPartOf <https://pt.wikipedia.org/> }
    OPTIONAL { ?artEn schema:about ?f; schema:isPartOf <https://en.wikipedia.org/> }
    ?f rdfs:label ?label . FILTER(LANG(?label) IN ("pt","en"))
    ${LBL} } LIMIT 40`);
  const des = [...new Set(rows.map(r => val(r, 'desLabel')).filter(x => x && !isQ(x)))];
  const r0 = rows[0] || {};
  return { des, inc: year(rows.map(r => val(r, 'inc')).filter(Boolean).sort()[0]), img: val(r0, 'img'), artPt: rows.map(r => val(r, 'artPt')).find(Boolean), artEn: rows.map(r => val(r, 'artEn')).find(Boolean) };
};
/* bandeiras anteriores encadeadas por "substitui" (P1365) ou "precedido por" (P155) */
const predecessors = async q => {
  const rows = await sparql(`SELECT ?p ?pLabel ?img ?inc ?end ?s ?e WHERE {
    wd:${q} (wdt:P1365|wdt:P155)+ ?p .
    OPTIONAL { ?p wdt:P18 ?img } OPTIONAL { ?p wdt:P571 ?inc } OPTIONAL { ?p wdt:P576 ?end }
    OPTIONAL { ?p wdt:P580 ?s } OPTIONAL { ?p wdt:P582 ?e }
    ${LBL} } LIMIT 60`);
  const by = {};
  rows.forEach(r => { const id = qid(val(r, 'p')); const o = by[id] || (by[id] = { label: val(r, 'pLabel'), img: null, from: null, to: null }); o.img = o.img || val(r, 'img'); o.from = o.from ?? year(val(r, 's') || val(r, 'inc')); o.to = o.to ?? year(val(r, 'e') || val(r, 'end')) });
  return Object.values(by).filter(x => x.img);
};

/* país (ISO 3166-1) ou estado (ISO 3166-2) */
const fromPlace = async (prop, code) => {
  const rows = await sparql(`SELECT ?c ?flag ?flagLabel ?img ?s ?e WHERE {
    ?c wdt:${prop} "${code}" .
    OPTIONAL { ?c p:P41 ?st . ?st ps:P41 ?img . OPTIONAL { ?st pq:P580 ?s } OPTIONAL { ?st pq:P582 ?e } }
    OPTIONAL { ?c wdt:P163 ?flag }
    ${LBL} } LIMIT 200`);
  if (!rows.length) return null;
  const flags = {}; rows.forEach(r => { const f = qid(val(r, 'flag')); if (f) flags[f] = val(r, 'flagLabel') || '' });
  const pick = Object.entries(flags).sort((a, b) => (/^(bandeira|flag)\s/i.test(b[1]) - /^(bandeira|flag)\s/i.test(a[1])) || (/(naval|marinha|civil|estado|state|ensign|jack|presid)/i.test(a[1]) - /(naval|marinha|civil|estado|state|ensign|jack|presid)/i.test(b[1])))[0];
  const tl = {}; rows.forEach(r => { const i = val(r, 'img'); if (!i) return; const o = tl[i] || (tl[i] = { img: i, from: null, to: null }); o.from = o.from ?? year(val(r, 's')); o.to = o.to ?? year(val(r, 'e')) });
  return { flagQ: pick ? pick[0] : null, timeline: Object.values(tl) };
};

const enApi = async titles => {
  const u = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=pageimages|pageprops|langlinks&piprop=original|thumbnail&pithumbsize=600&ppprop=wikibase_item&lllang=pt&lllimit=1&titles=' + encodeURIComponent(titles.join('|'));
  const r = await tfetch(u); if (!r.ok) throw new Error('Wikipédia ' + r.status); const j = await r.json();
  const map = {}; const norm = {}; (j.query.normalized || []).forEach(n => norm[n.to] = n.from); (j.query.redirects || []).forEach(n => norm[n.to] = norm[n.from] || n.from);
  Object.values(j.query.pages || {}).forEach(p => { if (p.missing !== undefined) return; const asked = norm[p.title] || p.title; map[asked] = { title: p.title, q: p.pageprops?.wikibase_item, img: p.original?.source || p.thumbnail?.source || null, thumb: p.thumbnail?.source || null, pt: p.langlinks?.[0]?.['*'] || null } });
  return map;
};

const W = {};
/* imagens das bandeiras militares (uma chamada para todas) */
W.militares = async list => {
  const todo = list.filter(f => f.wt && !f.src); if (!todo.length) return false;
  const ck = 'pi-' + todo.map(f => f.id).join(',').length + '-' + todo.length; let map = cacheGet(ck);
  if (!map) { try { map = {}; for (let i = 0; i < todo.length; i += 45) Object.assign(map, await enApi(todo.slice(i, i + 45).map(f => f.wt))); cacheSet(ck, map) } catch (e) { return false } }
  let ch = false; todo.forEach(f => { const m = map[f.wt]; if (m && m.img) { f.src = m.img; f.wq = m.q; f.wpt = m.pt; f.wen = m.title; f.fonte = 'wiki'; ch = true } });
  return ch;
};

/* ficha completa: adoção, designer, contexto e linha do tempo */
W.info = async f => {
  const key = 'i-' + f.id; const c = cacheGet(key); if (c) return c;
  const out = { inc: null, des: [], ctx: null, tl: [], ok: false };
  try {
    let flagQ = null, tl = [];
    if (f.t === 'pais' || f.t === 'estado') {
      const code = f.t === 'estado' ? 'BR-' + f.k : (/^GB-/.test(f.k) ? f.k : f.k);
      const p = await fromPlace(f.t === 'estado' || /^GB-/.test(f.k) ? 'P300' : 'P297', code);
      if (p) { flagQ = p.flagQ; tl = p.timeline }
    } else if (f.t === 'militar' || f.t === 'ilha') {
      if (!f.wq && f.wt) { try { const m = await enApi([f.wt]); const x = m[f.wt]; if (x) { f.wq = x.q; f.wpt = x.pt; f.wen = x.title; if (!f.src && x.img) f.src = x.img } } catch (e) { } }
      flagQ = f.wq || null;
    }
    let info = null;
    if (flagQ) { info = await flagItem(flagQ); out.inc = info.inc; out.des = info.des }
    if (flagQ && tl.filter(x => x.img).length < 2) {
      const prev = await predecessors(flagQ).catch(() => []);
      const cur = { img: info?.img || tl.find(x => !x.to)?.img || null, from: info?.inc || null, to: null, cur: true };
      tl = prev.concat(cur.img ? [cur] : []);
    }
    tl = tl.filter(x => x.img);
    const seen = new Set(); tl = tl.filter(x => { const k = x.img.split('/').pop(); if (seen.has(k)) return false; seen.add(k); return true });
    tl.sort((a, b) => (a.cur ? 1 : 0) - (b.cur ? 1 : 0) || (a.to == null) - (b.to == null) || (a.from ?? 9999) - (b.from ?? 9999));
    if (tl.length && !tl.some(x => x.cur)) { const last = tl.filter(x => x.to == null).pop() || tl[tl.length - 1]; last.cur = true }
    out.tl = tl.map(x => ({ img: thumb(x.img, 360), from: x.from, to: x.to, cur: !!x.cur, label: x.label || null }));
    const ptT = titleOf(info?.artPt) || (f.wt ? f.wpt : null);
    const enT = titleOf(info?.artEn) || (f.wt ? f.wen : null);
    out.ctx = await summary('pt', ptT) || await summary('en', enT);
    out.art = { pt: ptT, en: enT };
    out.ok = true;
  } catch (e) { out.err = e.message }
  if (out.ok) cacheSet(key, out);
  return out;
};

/* ---------- páginas da Wikipédia: listas de bandeiras e artigos de bandeira ---------- */
const API = lang => `https://${lang}.wikipedia.org/w/api.php?format=json&origin=*&formatversion=2`;
const parsePage = async (lang, title) => {
  const r = await tfetch(API(lang) + '&action=parse&prop=text&redirects=1&disableeditsection=1&page=' + encodeURIComponent(title), 15000);
  if (!r.ok) throw new Error('Wikipédia ' + r.status); const j = await r.json(); if (j.error) throw new Error(j.error.info);
  return { html: j.parse.text, title: j.parse.title };
};
const absu = u => !u ? u : u.startsWith('//') ? 'https:' + u : u.startsWith('/') ? 'https://' + 'upload.wikimedia.org' + u : u;
const bigger = (u, w = 960) => u ? u.replace(/\/(\d+)px-/, `/${w}px-`) : u;
const clean = s => String(s || '').replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
const YR = /(\d{3,4})(?:\s*(?:–|—|-|a|to|até)\s*(\d{3,4}|present|presente|atual|atualmente|hoje|today|now))?/i;
const years = t => { const m = YR.exec(t || ''); if (!m) return null; const a = +m[1]; if (a < 700 || a > 2100) return null; let b = null, cur = false; if (m[2]) { if (/^\d/.test(m[2])) { b = +m[2]; if (b < a) b = null } else cur = true } return { from: a, to: b, cur } };
const STOP = /^(see also|references|notes|external links|bibliography|further reading|sources|ver também|referências|notas|ligações externas|bibliografia|leitura adicional|fontes)\b/i;
W.extract = html => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const root = doc.querySelector('.mw-parser-output') || doc.body;
  const out = [], seen = new Set(); let sec = '';
  const push = (img, cap) => {
    if (!img) return; const w = +(img.getAttribute('width') || 0); if (w && w < 40) return;
    const src = img.getAttribute('src'); if (!src || /\/static\/|Commons-logo|Wiki_letter|Edit-clear|Question_book|Ambox/i.test(src)) return;
    const a = img.closest('a'), href = a ? (a.getAttribute('href') || '') : '';
    const file = decodeURIComponent((href.match(/\/wiki\/(?:File|Ficheiro|Arquivo|Imagem|Image):([^?#]+)/) || [])[1] || '').replace(/_/g, ' ');
    const key = file || src; if (seen.has(key)) return; seen.add(key);
    out.push({ sec, img: absu(src), big: absu(bigger(src)), file, cap: clean(cap).slice(0, 320) });
  };
  const walk = el => {
    for (const n of el.children) {
      const tag = n.tagName;
      if (/^H[2-4]$/.test(tag) || (n.classList && n.classList.contains('mw-heading'))) { const h = /^H/.test(tag) ? n : (n.querySelector('h2,h3,h4') || n); sec = clean(h.textContent); if (STOP.test(sec)) return 'stop'; continue }
      if (tag === 'TABLE' && n.classList.contains('infobox')) continue;
      if (tag === 'TABLE' && (n.classList.contains('wikitable') || n.querySelector('img'))) { for (const tr of n.querySelectorAll('tr')) { const img = tr.querySelector('img'); if (!img) continue; const cells = [...tr.children].filter(c => !c.querySelector('img')); push(img, cells.map(c => clean(c.textContent)).filter(Boolean).join(' · ')) } continue }
      if (n.matches && n.matches('ul.gallery, .gallery')) { n.querySelectorAll('.gallerybox, li').forEach(li => { const c = li.querySelector('.gallerytext'); push(li.querySelector('img'), c ? c.textContent : '') }); continue }
      if (n.matches && n.matches('figure, .thumb')) { const c = n.querySelector('figcaption, .thumbcaption'); push(n.querySelector('img'), c ? c.textContent : ''); continue }
      if (n.matches && n.matches('.tmulti, .thumbinner')) { n.querySelectorAll('.tsingle, .thumbimage').forEach(t => { const c = t.querySelector('.thumbcaption') || n.querySelector('.thumbcaption'); push(t.querySelector('img') || t, c ? c.textContent : '') }); continue }
      if (n.children && n.children.length && !/^(P|SPAN|A|SUP|STYLE|SCRIPT)$/.test(tag)) { if (walk(n) === 'stop') return 'stop' }
    }
  };
  walk(root);
  return out.slice(0, 400);
};
const HIST = /hist|former|anterior|antig|evolu|past|colonial|dynast|dinast/i;
const toTimeline = items => {
  const tl = [], keys = new Set();
  items.forEach(it => { const y = years(it.cap) || years(it.sec); if (!y) return; if (!(HIST.test(it.sec) || y.to)) return; const k = y.from + '-' + (y.to || ''); if (keys.has(k)) return; keys.add(k); tl.push({ img: it.img, big: it.big, from: y.from, to: y.to, cur: false, label: it.cap.replace(YR, '').replace(/^[\s·,;:–-]+|[\s·,;:–-]+$/g, '').slice(0, 90), file: it.file }) });
  tl.sort((a, b) => a.from - b.from || (a.to || 9999) - (b.to || 9999));
  return tl.slice(0, 40);
};
const exists = async (lang, titles) => {
  const r = await tfetch(API(lang) + '&action=query&redirects=1&prop=langlinks&lllang=pt&titles=' + encodeURIComponent(titles.join('|')));
  const j = await r.json(); const q = j.query || {}; const back = {};
  (q.normalized || []).forEach(n => back[n.to] = n.from); (q.redirects || []).forEach(n => back[n.to] = back[n.from] || n.from);
  const ok = {}; (q.pages || []).forEach(p => { if (!p.missing && !p.invalid) ok[back[p.title] || p.title] = { title: p.title, pt: p.langlinks && p.langlinks[0] ? p.langlinks[0].title : null } });
  return ok;
};
const cap1 = s => s ? s[0].toUpperCase() + s.slice(1) : s;
/* lista de bandeiras do país ("List of Chinese flags" e similares) */
W.lista = async f => {
  if (f.t !== 'pais') return null;
  const key = 'l-' + f.id; const c = cacheGet(key); if (c) return c;
  const prop = /^GB-/.test(f.k) ? 'P300' : 'P297';
  const rows = await sparql(`SELECT ?lab ?dem WHERE { ?c wdt:${prop} "${f.k}" . ?c rdfs:label ?lab FILTER(LANG(?lab)="en") OPTIONAL { ?c wdt:P1549 ?dem FILTER(LANG(?dem)="en") } } LIMIT 20`);
  const lab = rows.map(r => val(r, 'lab')).find(Boolean); if (!lab) return null;
  const dems = [...new Set(rows.map(r => val(r, 'dem')).filter(Boolean))];
  const cands = [...dems.map(d => `List of ${cap1(d)} flags`), `List of flags of ${lab}`, `List of flags of the ${lab}`, `Flags of ${lab}`];
  let found = null;
  try { const ok = await exists('en', cands); const k = cands.find(t => ok[t]); if (k) found = ok[k] } catch (e) { }
  if (!found) {
    try { const r = await tfetch(API('en') + '&action=query&list=search&srlimit=6&srsearch=' + encodeURIComponent(`intitle:flags "${lab}"`)); const j = await r.json(); const t = (j.query?.search || []).map(x => x.title).find(t => /^list of .*flags|^flags of/i.test(t) && t.includes(lab.split(' ')[0])); if (t) { const ok = await exists('en', [t]); found = ok[t] || null } } catch (e) { }
  }
  if (!found) { const out = { none: true }; cacheSet(key, out); return out }
  const lang = found.pt ? 'pt' : 'en', title = found.pt || found.title;
  const pg = await parsePage(lang, title);
  const items = W.extract(pg.html);
  const secs = []; items.forEach(it => { let s = secs.find(x => x.name === it.sec); if (!s) { s = { name: it.sec || 'Bandeiras', items: [] }; secs.push(s) } s.items.push(it) });
  const url = `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(pg.title.replace(/ /g, '_'))}`;
  const out = { lang, title: pg.title, url, tr: lang === 'en' ? `https://en-wikipedia-org.translate.goog/wiki/${encodeURIComponent(pg.title.replace(/ /g, '_'))}?_x_tr_sl=en&_x_tr_tl=pt&_x_tr_hl=pt` : null, sections: secs, timeline: toTimeline(items) };
  cacheSet(key, out); return out;
};
/* bandeiras anteriores a partir do artigo da própria bandeira */
W.histArtigo = async (f, art) => {
  const key = 'h-' + f.id; const c = cacheGet(key); if (c) return c;
  const t = art && (art.pt ? { lang: 'pt', title: art.pt } : art.en ? { lang: 'en', title: art.en } : null); if (!t) return null;
  const pg = await parsePage(t.lang, t.title); const tl = toTimeline(W.extract(pg.html));
  const out = { tl, url: `https://${t.lang}.wikipedia.org/wiki/${encodeURIComponent(pg.title.replace(/ /g, '_'))}`, title: pg.title, lang: t.lang };
  cacheSet(key, out); return out;
};
/* linha do tempo: Wikipédia primeiro, Wikidata como reserva */
W.timeline = async (f, info, lista) => {
  let tl = lista && lista.timeline && lista.timeline.length ? lista.timeline : null, src = tl ? { name: 'Wikipédia', url: lista.url, title: lista.title } : null;
  if (!tl || tl.length < 1) { try { const h = await W.histArtigo(f, info && info.art); if (h && h.tl.length) { tl = h.tl; src = { name: 'Wikipédia', url: h.url, title: h.title } } } catch (e) { } }
  const curImg = f.src || (info && info.tl && info.tl.find(x => x.cur) || {}).img || null;
  if (tl && tl.length) {
    const last = tl[tl.length - 1];
    if (curImg) tl = tl.concat([{ img: curImg, big: curImg, from: f.y || (info && info.inc) || (last.to || null), to: null, cur: true, label: 'Bandeira atual' }]);
    return { items: tl, src };
  }
  return { items: (info && info.tl) || [], src: info && info.tl && info.tl.length ? { name: 'Wikidata', url: null } : null };
};
window.FLWIKI = W;
})();
