(() => {
'use strict';
// Não instala analytics, pixels, marketing ou cookies opcionais.
const key='gama_privacy_notice_v1';
const notice=document.createElement('aside');notice.className='privacy-notice';notice.setAttribute('aria-label','Privacidade e armazenamento');
notice.innerHTML='<strong>Sua privacidade no GamaMC</strong><p>Esta página não instala cookies de publicidade ou análise. A hospedagem pode registrar dados técnicos de acesso. Guardamos somente sua preferência de exibição deste aviso neste navegador. Na loja, a sessão de login e a seleção de plano são necessárias ao serviço. <a href="https://www.gamamc.com/politicas.html#cookies">Entenda os cookies e seus direitos</a>.</p><button type="button">Entendi e fechar</button>';
try{notice.hidden=localStorage.getItem(key)==='dismissed';}catch{}
notice.querySelector('button').addEventListener('click',()=>{notice.hidden=true;try{localStorage.setItem(key,'dismissed');}catch{}});
document.body.append(notice);
const settings=document.createElement('button');settings.type='button';settings.className='privacy-settings';settings.textContent='Privacidade e cookies';settings.addEventListener('click',()=>{notice.hidden=false;notice.querySelector('button').focus();});
(document.querySelector('footer')||document.querySelector('main')||document.body).append(settings);
})();