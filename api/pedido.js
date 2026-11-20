/* Flâmula · aviso por e-mail de pedidos de administrador e de colaboração.
   O site grava o pedido no Firestore (coleção "pedidos") e chama esta função com o id.
   A função lê o pedido direto do Firestore (não confia no que o navegador manda) e envia
   ao administrador um e-mail com os botões "Aprovar" e "Declinar".

   Variáveis de ambiente na Vercel:
   - RESEND_API_KEY   (obrigatória) chave da conta no resend.com
   - ADMIN_EMAIL      (opcional) destino; padrão: o e-mail do administrador principal
   - MAIL_FROM        (opcional) remetente; padrão: "Flâmula <onboarding@resend.dev>"
   - SITE_URL         (opcional) endereço do site; padrão: https://flamula.vercel.app
   - FIREBASE_PROJECT_ID (opcional) padrão: flamula-app */
const PROJ = process.env.FIREBASE_PROJECT_ID || 'flamula-app';
const SITE = (process.env.SITE_URL || 'https://flamula.vercel.app').replace(/\/$/, '');
const PARA = process.env.ADMIN_EMAIL || 'louieikishima@gmail.com';
const DE = process.env.MAIL_FROM || 'Flâmula <onboarding@resend.dev>';
const vistos = new Map();

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const val = f => f == null ? '' : f.stringValue ?? (f.integerValue != null ? String(f.integerValue) : f.booleanValue != null ? String(f.booleanValue) : '');
const AREA = { curadoria: 'Curadoria de bandeiras', pesquisa: 'Pesquisa histórica', traducao: 'Tradução', design: 'Design', desenvolvimento: 'Desenvolvimento', moderacao: 'Moderação', direitos: 'Direitos autorais e remoção', outro: 'Outro' };

const botao = (href, txt, cor) => `<a href="${href}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:${cor};color:#fff;font:600 16px -apple-system,Segoe UI,Roboto,Arial,sans-serif;text-decoration:none;margin:0 6px 10px 0">${txt}</a>`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ erro: 'use POST' }); return }
  const id = String((req.body && req.body.id) || '');
  if (!/^[A-Za-z0-9]{10,40}$/.test(id)) { res.status(400).json({ erro: 'pedido inválido' }); return }
  if (!process.env.RESEND_API_KEY) { res.status(503).json({ erro: 'envio de e-mail não configurado' }); return }
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0] || 'x', agora = Date.now();
  const L = (vistos.get(ip) || []).filter(t => agora - t < 3600e3); if (L.length >= 5) { res.status(429).json({ erro: 'muitos pedidos; tente mais tarde' }); return }
  L.push(agora); vistos.set(ip, L);
  try {
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJ}/databases/(default)/documents/pedidos/${id}`);
    if (!r.ok) { res.status(404).json({ erro: 'pedido não encontrado' }); return }
    const f = (await r.json()).fields || {};
    if (val(f.status) !== 'pendente') { res.status(409).json({ erro: 'pedido já decidido' }); return }
    const tipo = val(f.tipo) === 'admin' ? 'admin' : 'colaborador';
    const nome = val(f.nome) || 'Sem nome', email = val(f.email), msg = val(f.mensagem), area = AREA[val(f.area)] || '', uid = val(f.uid);
    const titulo = tipo === 'admin' ? 'Pedido para ser administrador' : 'Pedido para ser colaborador';
    const link = a => `${SITE}/#decidir-${id}-${a}`;
    const html = `<div style="background:#E6F3F8;padding:28px 12px;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#12303F">
      <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:24px;padding:28px">
        <p style="margin:0 0 6px;color:#065B98;font-weight:700;letter-spacing:.02em">FLÂMULA</p>
        <h1 style="margin:0 0 18px;font-size:24px">${titulo}</h1>
        <p style="margin:0 0 4px"><b>${esc(nome)}</b>${email ? ` · ${esc(email)}` : ''}</p>
        ${area ? `<p style="margin:0 0 4px;color:#4F6B7A">Área: ${esc(area)}</p>` : ''}
        ${uid ? `<p style="margin:0 0 4px;color:#4F6B7A;font-size:13px">UID: ${esc(uid)}</p>` : '<p style="margin:0 0 4px;color:#4F6B7A;font-size:13px">Enviado sem conta no Flâmula.</p>'}
        ${msg ? `<div style="margin:16px 0;padding:14px 16px;border-radius:14px;background:#F4F9FC;white-space:pre-wrap">${esc(msg)}</div>` : ''}
        <div style="margin-top:20px">${botao(link('aprovar'), 'Aprovar', '#1B7FDC')}${botao(link('declinar'), 'Declinar', '#8E8E93')}</div>
        <p style="margin:14px 0 0;font-size:12.5px;color:#4F6B7A">Os botões abrem o Flâmula; a decisão vale quando você estiver conectado com a conta de administrador.${tipo === 'admin' ? ' Ao aprovar, a pessoa ganha o painel de administração no perfil.' : ''}</p>
      </div></div>`;
    const m = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({ from: DE, to: [PARA], subject: `${titulo}: ${nome} · Flâmula`, html, reply_to: email || undefined })
    });
    if (!m.ok) { const t = await m.text(); res.status(502).json({ erro: 'falha no envio do e-mail', detalhe: t.slice(0, 300) }); return }
    res.status(200).json({ ok: true });
  } catch (e) { res.status(500).json({ erro: String(e.message || e) }) }
};
