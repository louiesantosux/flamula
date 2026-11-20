/* Flâmula · leitor do FOTW (Flags of the World)
   Função serverless da Vercel. Lê as páginas de bandeiras militares do FOTW,
   devolve as imagens com título, seção e crédito, e serve as imagens pelo próprio domínio.
   Imagens reproduzidas sem alteração, para consulta, com crédito ao autor e ao
   "FOTW Flags Of The World website at https://www.fotw.info/".

   GET /api/fotw?lista=1            → países listados em x-milt.html
   GET /api/fotw?p=cn^milit.html    → bandeiras de uma página (aceita #âncora)
   GET /api/fotw?img=c/cn^pla.gif   → a imagem em si
*/
const BASE = 'https://www.crwflags.com/fotw/';
const UA = 'Mozilla/5.0 (compatible; Flamula/1.0; leitor de consulta com crédito ao FOTW)';
const NAV = /^(mailme|keyword|bib-|index|search|disclaim|mirror|contact|keywords|x-|fotw|whatsnew|faq|vexilla|links|nav|abbr|siteinfo|editors|thanks|books|glossary|vxt|mirrors|copyright|flagspot)/i;

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', laquo: '«', raquo: '»', ndash: '–', mdash: '—', hellip: '…', deg: '°', middot: '·', copy: '©', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', szlig: 'ß' };
const ACC = { acute: '\u0301', grave: '\u0300', circ: '\u0302', tilde: '\u0303', uml: '\u0308', ring: '\u030A', cedil: '\u0327', caron: '\u030C' };
const ent = s => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);?/gi, (m, e) => {
  if (e[0] === '#') { const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return n ? String.fromCodePoint(n) : m }
  if (ENT[e.toLowerCase()] != null) return ENT[e.toLowerCase()];
  const a = e.match(/^([a-z])(acute|grave|circ|tilde|uml|ring|cedil|caron)$/i); if (a) return (a[1] + ACC[a[2].toLowerCase()]).normalize('NFC');
  if (/^aelig$/i.test(e)) return e[0] === 'A' ? 'Æ' : 'æ'; if (/^oslash$/i.test(e)) return e[0] === 'O' ? 'Ø' : 'ø';
  return m;
});
const clean = s => ent(String(s || '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const attr = (a, n) => { const m = a.match(new RegExp('\\b' + n + '\\s*=\\s*("([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i')); return m ? ent(m[2] ?? m[3] ?? m[4] ?? '') : null };

async function get(url) {
  const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,*/*' } });
  if (!r.ok) throw new Error('FOTW respondeu ' + r.status);
  const b = Buffer.from(await r.arrayBuffer());
  let cs = ((r.headers.get('content-type') || '').match(/charset=([\w-]+)/i) || [])[1];
  if (!cs) { const m = b.subarray(0, 3000).toString('latin1').match(/charset=["']?([\w-]+)/i); cs = m && m[1] }
  cs = (cs || 'windows-1252').toLowerCase(); if (cs === 'iso-8859-1' || cs === 'latin1') cs = 'windows-1252';
  try { return new TextDecoder(cs).decode(b) } catch (e) { return b.toString('latin1') }
}

/* x-milt.html → [{code, nome, links:[{href, txt}]}] */
function parseLista(html) {
  const out = new Map(); const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi; let m;
  const body = html.slice(Math.max(0, html.search(/<table/i)));
  while ((m = re.exec(body))) {
    const href = attr(m[1], 'href'); if (!href) continue;
    const file = href.replace(/^https?:\/\/[^/]+\/fotw\/flags\//i, '').replace(/^\.\//, '');
    if (/[/:]/.test(file.split('#')[0]) || !/\.html?(#|$)/i.test(file)) continue;
    const base = file.split('#')[0]; if (NAV.test(base) || !/^[a-z]{2}[-_^~!.]/i.test(base)) continue;
    const code = base.slice(0, 2).toLowerCase(); const txt = clean(m[2]); if (!txt) continue;
    if (!out.has(code)) out.set(code, { code, nome: txt, links: [] });
    const g = out.get(code); if (!g.links.some(l => l.href === file)) g.links.push({ href: file, txt });
  }
  return [...out.values()];
}

/* página → {titulo, itens:[{img, label, sec, credito, prop}], links:[{href, txt}]} */
function parsePage(html, file) {
  const hash = (file.split('#')[1] || '').trim(); const pageUrl = BASE + 'flags/' + file.split('#')[0];
  let h = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');
  const titulo = clean((h.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]).replace(/^FOTW\s*[«»:\-–]*\s*/i, '');
  const bi = h.search(/<body/i); if (bi >= 0) h = h.slice(bi);
  let parcial = false;
  if (hash) {
    const safe = hash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const am = new RegExp('<a\\b[^>]*\\b(?:name|id)\\s*=\\s*["\']?' + safe + '["\'\\s>]', 'i').exec(h);
    if (am) { h = h.slice(am.index); const e = h.slice(5).search(/<hr\b/i); if (e > 0) h = h.slice(0, e + 5); parcial = true }
  }
  const itens = [], links = [], seen = new Set(), seenL = new Set();
  let sec = '', bold = '', cap = null, last = null, linkHref = null, linkTxt = '';
  const re = /<(\/?)(h[1-6]|img|hr|b|strong|a|br|p|td|tr|li|div|center|table|dd|dt)\b([^>]*)>|([^<]+)|<[^>]*>|</gi; let m;
  const push = t => { if (last && last.after.length < 600) last.after += t };
  while ((m = re.exec(h))) {
    const [, close, tagRaw, a, text] = m;
    if (!tagRaw && text == null) continue;
    if (text != null) {
      const t = ent(text);
      if (cap) cap.t += t;
      if (linkHref != null) linkTxt += t;
      push(t); continue;
    }
    const tag = tagRaw.toLowerCase();
    if (/^h[1-6]$/.test(tag) || tag === 'b' || tag === 'strong') {
      if (!close) cap = { tag, t: '' };
      else if (cap) { const t = cap.t.replace(/\s+/g, ' ').trim(); if (t && t.length < 140) { if (cap.tag[0] === 'h' && cap.tag !== 'h1') { sec = t; bold = '' } else if (cap.tag[0] !== 'h') bold = t } cap = null }
      if (tag[0] === 'h') push('\n');
      continue;
    }
    if (tag === 'a') {
      if (!close) { const hr = attr(a, 'href'); linkHref = hr; linkTxt = '' }
      else if (linkHref != null) {
        const f = linkHref.replace(/^https?:\/\/[^/]+\/fotw\/flags\//i, '').replace(/^\.\//, '');
        const base = f.split('#')[0]; const t = linkTxt.replace(/\s+/g, ' ').trim();
        if (t && base && /\.html?$/i.test(base) && !/[/:]/.test(base) && !NAV.test(base) && base !== file.split('#')[0] && !seenL.has(f)) { seenL.add(f); links.push({ href: f, txt: t.slice(0, 90) }) }
        linkHref = null;
      }
      continue;
    }
    if (tag === 'img' && !close) {
      const src = attr(a, 'src'); if (!src) continue;
      let u; try { u = new URL(src, pageUrl) } catch (e) { continue }
      const mm = u.pathname.match(/\/fotw\/images\/([a-z0-9])\/([^/]+\.(gif|png|jpe?g))$/i); if (!mm) continue;
      const w = +attr(a, 'width') || 0, hh = +attr(a, 'height') || 0; if ((w && w < 40) || (hh && hh < 20)) continue;
      const key = mm[1] + '/' + decodeURIComponent(mm[2]); if (seen.has(key)) continue; seen.add(key);
      const alt = clean(attr(a, 'alt') || '').replace(/^\[|\]$/g, '').trim();
      last = { img: key, label: bold || alt || sec, alt, sec, after: '' }; itens.push(last); bold = '';
      continue;
    }
    push('\n');
  }
  for (const it of itens) {
    const t = it.after.replace(/[ \t\r\f\v]+/g, ' ');
    const c = t.match(/\b(images?\s+(?:[a-z]+\s+){0,2}by\s+[^\n]{2,160})/i); it.credito = c ? c[1].replace(/\s+/g, ' ').trim() : '';
    const p = t.match(/proportions?\s*:?\s*(\d+(?:[.,]\d+)?\s*:\s*\d+(?:[.,]\d+)?)/i); it.prop = p ? p[1].replace(/\s/g, '') : '';
    delete it.after; if (it.label === it.sec) it.label = it.alt || it.sec;
  }
  return { titulo, url: pageUrl + (hash ? '#' + hash : ''), parcial, itens, links: links.slice(0, 200) };
}

module.exports = async (req, res) => {
  const q = req.query || {};
  try {
    if (q.img) {
      const p = String(q.img);
      if (!/^[a-z0-9]\/[\w^~!.\-]+\.(gif|png|jpe?g)$/i.test(p)) { res.status(400).end('imagem inválida'); return }
      const r = await fetch(BASE + 'images/' + p.split('/').map(encodeURIComponent).join('/'), { headers: { 'user-agent': UA, referer: BASE } });
      if (!r.ok) { res.status(r.status === 404 ? 404 : 502).end(); return }
      res.setHeader('content-type', r.headers.get('content-type') || 'image/gif');
      res.setHeader('cache-control', 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800');
      res.status(200).end(Buffer.from(await r.arrayBuffer())); return;
    }
    let data;
    if (q.lista) data = { paises: parseLista(await get(BASE + 'flags/x-milt.html')) };
    else if (q.p) {
      const file = String(q.p);
      if (!/^[\w^~!.\-]+\.html?(#[\w\-.]*)?$/i.test(file)) { res.status(400).json({ erro: 'página inválida' }); return }
      data = parsePage(await get(BASE + 'flags/' + file.split('#')[0].split('/').map(encodeURIComponent).join('/')), file);
    } else { res.status(400).json({ erro: 'use ?lista=1, ?p= ou ?img=' }); return }
    data.fonte = 'FOTW Flags Of The World website at https://www.fotw.info/';
    res.setHeader('cache-control', 'public, max-age=3600, s-maxage=604800, stale-while-revalidate=2592000');
    res.status(200).json(data);
  } catch (e) {
    res.setHeader('cache-control', 'no-store');
    res.status(502).json({ erro: String(e.message || e) });
  }
};
module.exports.parsePage = parsePage; module.exports.parseLista = parseLista;
