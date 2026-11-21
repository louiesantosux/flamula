/* Flâmula · "Apoie o projeto": modal com QR Code Pix e "Pix copia e cola".
   O código vem de config/apoio no Firestore (definido no painel de administração → Apoio).
   Pode ser um código copia e cola colado do app do banco, ou gerado aqui a partir da chave, nome e cidade (BR Code estático, padrão do Banco Central). */
(() => {
const FL = window.FL; if (!FL) return;
const { $, toast, esc, sheet } = FL;
const FB = () => window.FB || {};

/* ---------- BR Code (EMV) ---------- */
const crc16 = s => { let c = 0xFFFF; for (let i = 0; i < s.length; i++) { c ^= s.charCodeAt(i) << 8; for (let j = 0; j < 8; j++) c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF } return c.toString(16).toUpperCase().padStart(4, '0') };
const tlv = (id, v) => id + String(v.length).padStart(2, '0') + v;
const ascii = (s, n) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\x20-\x7E]/g, '').trim().slice(0, n);
const brcode = ({ chave, nome, cidade, txid }) => {
  const k = String(chave || '').trim();
  const gui = tlv('00', 'BR.GOV.BCB.PIX') + tlv('01', k);
  let s = tlv('00', '01') + tlv('26', gui) + tlv('52', '0000') + tlv('53', '986') + tlv('58', 'BR') + tlv('59', ascii(nome, 25) || 'FLAMULA') + tlv('60', ascii(cidade, 15).toUpperCase() || 'BRASIL') + tlv('62', tlv('05', ascii(txid, 25).replace(/[^A-Za-z0-9]/g, '') || '***'));
  s += '6304'; return s + crc16(s);
};
const valido = c => { c = String(c || '').trim(); if (!/^000201/.test(c) || c.length < 30 || !/6304[0-9A-Fa-f]{4}$/.test(c)) return false; return crc16(c.slice(0, -4)) === c.slice(-4).toUpperCase() };
const codigoDe = d => d && (d.codigo && valido(d.codigo) ? d.codigo.trim() : d.chave ? brcode(d) : '');
FL.pix = { brcode, valido, crc16, codigoDe };

/* ---------- estilos ---------- */
const css = document.createElement('style');
css.textContent = `
.apo{display:grid;gap:16px;justify-items:center;text-align:center}
.apo p{margin:0;color:var(--mut);max-width:40ch}
.apo-qr{width:min(260px,70vw);aspect-ratio:1;border-radius:24px;background:#fff;padding:12px;box-shadow:0 10px 30px rgba(0,0,0,.18)}
.apo-qr svg{width:100%;height:100%;display:block}
.apo-rec{font-size:14px;color:var(--mut)}.apo-rec b{color:var(--ink)}
.apo-cod{width:100%;font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--mut);background:var(--chip);border-radius:14px;padding:10px 12px;word-break:break-all;text-align:left;max-height:72px;overflow:auto}
.apo .btn{width:100%;justify-content:center;min-height:50px;font-size:16px}
.apo .btn.ok{background:#1E8E3E;color:#fff}
.apo small{color:var(--mut);font-size:12.5px}
.apoio-l{display:inline-flex;gap:6px;align-items:center}.apoio-l svg{width:15px;height:15px;color:#FF5C7A}
`;
document.head.appendChild(css);

const HEART = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>';
let cache = null;
const carregar = async () => { if (cache) return cache; if (!(FB().on && FB().apoio)) return null; try { cache = await FB().apoio() } catch (e) { cache = null } return cache };
addEventListener('fl-apoio', e => { cache = e.detail });

const copiar = async t => { try { await navigator.clipboard.writeText(t); return true } catch (e) { const a = document.createElement('textarea'); a.value = t; a.setAttribute('readonly', ''); a.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(a); a.select(); let ok = false; try { ok = document.execCommand('copy') } catch (er) { } a.remove(); return ok } };

FL.actions.apoiar = async () => {
  const el = sheet('Apoie o projeto', '<div class="apo"><span class="sk" style="width:220px;height:220px;border-radius:24px"></span></div>');
  const d = await carregar(); const box = el.querySelector('.apo'); if (!box) return;
  const cod = codigoDe(d);
  if (!cod) { box.innerHTML = `<p>O apoio via Pix ainda não foi configurado. Volte em breve!</p>${FB().admin ? '<a class="btn acc pr" href="#admin" data-act="">Configurar no painel</a>' : ''}`; return }
  box.innerHTML = `<p>${esc(d.mensagem || 'O Flâmula é gratuito e sem anúncios. Se ele te ajuda ou diverte, um Pix de qualquer valor mantém o projeto no ar.')}</p>
    <div class="apo-qr">${window.FLQR ? FLQR(cod, { ec: 'M', label: 'QR Code Pix' }) : ''}</div>
    ${d.nome ? `<div class="apo-rec">Recebedor: <b>${esc(d.nome)}</b></div>` : ''}
    <button class="btn acc pr" id="apocp" aria-live="polite">Copiar código Pix</button>
    <div class="apo-cod" id="apocod">${esc(cod)}</div>
    <small>Abra o app do seu banco, escolha Pix → Ler QR Code ou Pix copia e cola, e defina o valor.</small>`;
  const b = $('apocp'); let t;
  b.onclick = async () => { const ok = await copiar(cod); clearTimeout(t); if (ok) { b.classList.add('ok'); b.textContent = '✓ Copiado!'; toast('Código Pix copiado'); t = setTimeout(() => { b.classList.remove('ok'); b.textContent = 'Copiar código Pix' }, 2500) } else { toast('Não foi possível copiar: selecione o código abaixo') ; const r = document.createRange(); r.selectNodeContents($('apocod')); const s = getSelection(); s.removeAllRanges(); s.addRange(r) } };
};
FL.apoioHeart = HEART;
})();
