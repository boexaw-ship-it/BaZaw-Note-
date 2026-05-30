// ══════════════════════════════════════════════
//  app.js — Main controller (Firebase version)
// ══════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Firebase Config ────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyAGig8fe3t9Z-q9jJFBYT1y3pMlN0ilrn0",
  authDomain:        "bazaw-note.firebaseapp.com",
  projectId:         "bazaw-note",
  storageBucket:     "bazaw-note.firebasestorage.app",
  messagingSenderId: "528020195884",
  appId:             "1:528020195884:web:f1cf22eb5b6c297ea75f89"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Helpers ────────────────────────────────────
function val(id)        { return (document.getElementById(id)?.value || '').trim(); }
function setEl(id, txt) { const e = document.getElementById(id); if (e) e.textContent = txt; }
function toNum(v)       { return parseFloat(String(v).replace(/,/g, '')) || 0; }
function formatMoney(n) { return (parseFloat(String(n).replace(/,/g,''))||0).toLocaleString('en-US'); }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});

// ── API ────────────────────────────────────────
const API = {
  async getAll() {
    try {
      const cols   = ['apartments','goods','finance','property','bank'];
      const result = {};
      for (const col of cols) {
        const snap   = await getDocs(collection(db, col));
        result[col]  = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
      return result;
    } catch (e) {
      console.error('getAll error:', e);
      return {};
    }
  },

  async addRow(col, data) {
    try {
      const ref = await addDoc(collection(db, col), {
        ...data,
        createdAt: serverTimestamp()
      });
      return { status: 'ok', id: ref.id };
    } catch (e) {
      console.error('addRow error:', e);
      showToast('သိမ်းဆည်း မအောင်မြင်ဘူး ❌');
      return null;
    }
  }
};

// ── Page Modules ───────────────────────────────

const Apartments = {
  data: [],
  async load() {
    const all = await API.getAll();
    this.data = all.apartments || [];
    this.render(); this.updateSummary();
  },
  render() {
    const tb = document.getElementById('apt-tbody');
    if (!tb) return;
    if (!this.data.length) {
      tb.innerHTML = `<tr><td colspan="6"><div class="empty-state"><span class="empty-icon">🏢</span><p>စာရင်း မရှိသေးပါ</p></div></td></tr>`;
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    tb.innerHTML = this.data.map(r => {
      const active = r['End Date'] && r['End Date'] >= today;
      const badge  = active
        ? `<span class="badge badge-green">ငှားရမ်းဆဲ</span>`
        : `<span class="badge badge-red">ကျော်လွန်</span>`;
      return `<tr>
        <td>${r['တိုက်ခန်း']||'-'}</td>
        <td>${r['အငှားရသူ']||'-'}</td>
        <td style="color:var(--gold);font-weight:600;">${formatMoney(r['လချုပ်ကြေး'])} ကျပ်</td>
        <td>${r['Start Date']||'-'}</td>
        <td>${r['End Date']||'-'}</td>
        <td>${badge}</td>
      </tr>`;
    }).join('');
  },
  updateSummary() {
    const today  = new Date().toISOString().split('T')[0];
    const active = this.data.filter(r => r['End Date'] && r['End Date'] >= today);
    setEl('apt-total-rent',       formatMoney(this.data.reduce((s,r)=>s+toNum(r['လချုပ်ကြေး']),0))+' ကျပ်');
    setEl('apt-total-units',      this.data.length+' ခန်း');
    setEl('apt-active-contracts', active.length+' ခန်း');
  },
  async submit() {
    const room=val('apt-room'), rent=val('apt-rent'), tenant=val('apt-tenant');
    const start=val('apt-start-date'), end=val('apt-end-date');
    if (!room||!rent||!tenant||!start||!end) { showToast('ဖြည့်ရမည့် အချက်များ ဖြည့်ပါ ⚠️'); return; }
    if (end < start) { showToast('End Date သည် Start Date ထက် နောက်ကျရမည် ⚠️'); return; }
    showToast('သိမ်းဆည်းနေသည်... ⏳');
    const res = await API.addRow('apartments', {
      'တိုက်ခန်း':''+room,'အငှားရသူ':''+tenant,
      'လချုပ်ကြေး':''+rent,'Start Date':''+start,
      'End Date':''+end,'မှတ်ချက်':''+val('apt-note')
    });
    if (res?.status==='ok') {
      closeModal('apt-modal');
      ['apt-room','apt-rent','apt-tenant','apt-start-date','apt-end-date','apt-note']
        .forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
      showToast('သိမ်းဆည်းပြီး ✅');
      await this.load();
    }
  }
};

const Goods = {
  data: [],
  async load() {
    const all = await API.getAll();
    this.data = all.goods || [];
    this.render(); this.updateSummary();
  },
  render() {
    const tb = document.getElementById('goods-tbody');
    if (!tb) return;
    if (!this.data.length) {
      tb.innerHTML = `<tr><td colspan="6"><div class="empty-state"><span class="empty-icon">📦</span><p>စာရင်း မရှိသေးပါ</p></div></td></tr>`;
      return;
    }
    tb.innerHTML = this.data.map(r => {
      const isBuy = r['အဝယ်/အရောင်း']==='အဝယ်';
      return `<tr>
        <td>${r['ပစ္စည်းအမည်']||'-'}</td><td>${r['အမျိုးအစား']||'-'}</td>
        <td>${r['ပမာဏ']||'-'}</td>
        <td style="color:var(--gold);font-weight:600;">${formatMoney(r['တန်ဖိုး'])} ကျပ်</td>
        <td><span class="badge ${isBuy?'badge-red':'badge-green'}">${r['အဝယ်/အရောင်း']||'-'}</span></td>
        <td>${r['ရက်စွဲ']||'-'}</td>
      </tr>`;
    }).join('');
  },
  updateSummary() {
    const tb=this.data.filter(r=>r['အဝယ်/အရောင်း']==='အဝယ်').reduce((s,r)=>s+toNum(r['တန်ဖိုး']),0);
    const ts=this.data.filter(r=>r['အဝယ်/အရောင်း']==='အရောင်း').reduce((s,r)=>s+toNum(r['တန်ဖိုး']),0);
    setEl('goods-total-buy',formatMoney(tb)+' ကျပ်');
    setEl('goods-total-sell',formatMoney(ts)+' ကျပ်');
    setEl('goods-total-profit',formatMoney(ts-tb)+' ကျပ်');
    const el=document.getElementById('goods-total-profit');
    if(el) el.style.color=(ts-tb)>=0?'var(--gold)':'var(--red)';
  },
  async submit() {
    const name=val('goods-name'),price=val('goods-price'),date=val('goods-date');
    if(!name||!price||!date){showToast('ဖြည့်ရမည့် အချက်များ ဖြည့်ပါ ⚠️');return;}
    showToast('သိမ်းဆည်းနေသည်... ⏳');
    const res=await API.addRow('goods',{
      'ပစ္စည်းအမည်':''+name,'အမျိုးအစား':''+val('goods-cat'),
      'ပမာဏ':''+val('goods-qty'),'တန်ဖိုး':''+price,
      'အဝယ်/အရောင်း':''+val('goods-type'),'ရက်စွဲ':''+date,'မှတ်ချက်':''+val('goods-note')
    });
    if(res?.status==='ok'){closeModal('goods-modal');showToast('သိမ်းဆည်းပြီး ✅');await this.load();}
  }
};

const Finance = {
  data: [],
  async load() {
    const all=await API.getAll();
    this.data=all.finance||[];
    this.render();this.updateSummary();
  },
  render() {
    const tb=document.getElementById('finance-tbody');
    if(!tb)return;
    if(!this.data.length){
      tb.innerHTML=`<tr><td colspan="5"><div class="empty-state"><span class="empty-icon">💰</span><p>စာရင်း မရှိသေးပါ</p></div></td></tr>`;
      return;
    }
    tb.innerHTML=this.data.map(r=>{
      const isIn=r['အမျိုးအစား']==='ငွေဝင်';
      return `<tr>
        <td><span class="badge ${isIn?'badge-green':'badge-red'}">${r['အမျိုးအစား']||'-'}</span></td>
        <td style="color:${isIn?'var(--green)':'var(--red)'};font-weight:600;">${isIn?'+':'-'}${formatMoney(r['ငွေပမာဏ'])} ကျပ်</td>
        <td>${r['ရင်းမြစ်']||'-'}</td><td>${r['ရက်စွဲ']||'-'}</td><td>${r['မှတ်ချက်']||'-'}</td>
      </tr>`;
    }).join('');
  },
  updateSummary() {
    const ti=this.data.filter(r=>r['အမျိုးအစား']==='ငွေဝင်').reduce((s,r)=>s+toNum(r['ငွေပမာဏ']),0);
    const to=this.data.filter(r=>r['အမျိုးအစား']==='ငွေထွက်').reduce((s,r)=>s+toNum(r['ငွေပမာဏ']),0);
    const bal=ti-to;
    setEl('fin-total-in',formatMoney(ti)+' ကျပ်');
    setEl('fin-total-out',formatMoney(to)+' ကျပ်');
    setEl('fin-balance',formatMoney(bal)+' ကျပ်');
    const el=document.getElementById('fin-balance');
    if(el)el.style.color=bal>=0?'var(--green)':'var(--red)';
  },
  async submit() {
    const type=val('fin-type'),amount=val('fin-amount'),date=val('fin-date');
    if(!type||!amount||!date){showToast('ဖြည့်ရမည့် အချက်များ ဖြည့်ပါ ⚠️');return;}
    showToast('သိမ်းဆည်းနေသည်... ⏳');
    const res=await API.addRow('finance',{
      'အမျိုးအစား':''+type,'ငွေပမာဏ':''+amount,
      'ရင်းမြစ်':''+val('fin-source'),'ရက်စွဲ':''+date,'မှတ်ချက်':''+val('fin-note')
    });
    if(res?.status==='ok'){closeModal('fin-modal');showToast('သိမ်းဆည်းပြီး ✅');await this.load();}
  }
};

const Property = {
  data: [],
  async load() {
    const all=await API.getAll();
    this.data=all.property||[];
    this.render();this.updateSummary();
  },
  render() {
    const tb=document.getElementById('prop-tbody');
    if(!tb)return;
    if(!this.data.length){
      tb.innerHTML=`<tr><td colspan="5"><div class="empty-state"><span class="empty-icon">🏠</span><p>စာရင်း မရှိသေးပါ</p></div></td></tr>`;
      return;
    }
    const icons={'တိုက်ခန်း':'🏢','အိမ်':'🏠','ကား':'🚗','မြေ':'🌍'};
    tb.innerHTML=this.data.map(r=>{
      const isBuy=r['အဝယ်/အရောင်း']==='အဝယ်';
      return `<tr>
        <td>${icons[r['အမျိုးအစား']]||'📋'} ${r['အမျိုးအစား']||'-'}</td>
        <td>${r['ဖော်ပြချက်']||'-'}</td>
        <td style="color:var(--gold);font-weight:600;">${formatMoney(r['တန်ဖိုး'])} ကျပ်</td>
        <td><span class="badge ${isBuy?'badge-red':'badge-green'}">${r['အဝယ်/အရောင်း']||'-'}</span></td>
        <td>${r['ရက်စွဲ']||'-'}</td>
      </tr>`;
    }).join('');
  },
  updateSummary() {
    const tb=this.data.filter(r=>r['အဝယ်/အရောင်း']==='အဝယ်').reduce((s,r)=>s+toNum(r['တန်ဖိုး']),0);
    const ts=this.data.filter(r=>r['အဝယ်/အရောင်း']==='အရောင်း').reduce((s,r)=>s+toNum(r['တန်ဖိုး']),0);
    setEl('prop-total-buy',formatMoney(tb)+' ကျပ်');
    setEl('prop-total-sell',formatMoney(ts)+' ကျပ်');
    setEl('prop-net',formatMoney(ts-tb)+' ကျပ်');
    const el=document.getElementById('prop-net');
    if(el)el.style.color=(ts-tb)>=0?'var(--gold)':'var(--red)';
  },
  async submit() {
    const type=val('prop-type'),price=val('prop-price'),date=val('prop-date');
    if(!type||!price||!date){showToast('ဖြည့်ရမည့် အချက်များ ဖြည့်ပါ ⚠️');return;}
    showToast('သိမ်းဆည်းနေသည်... ⏳');
    const res=await API.addRow('property',{
      'အမျိုးအစား':''+type,'ဖော်ပြချက်':''+val('prop-desc'),
      'တန်ဖိုး':''+price,'အဝယ်/အရောင်း':''+val('prop-deal'),
      'ရက်စွဲ':''+date,'မှတ်ချက်':''+val('prop-note')
    });
    if(res?.status==='ok'){closeModal('prop-modal');showToast('သိမ်းဆည်းပြီး ✅');await this.load();}
  }
};

const Bank = {
  data: [],
  async load() {
    const all=await API.getAll();
    this.data=all.bank||[];
    this.render();this.updateSummary();
  },
  render() {
    const tb=document.getElementById('bank-tbody');
    if(!tb)return;
    if(!this.data.length){
      tb.innerHTML=`<tr><td colspan="4"><div class="empty-state"><span class="empty-icon">🏦</span><p>စာရင်း မရှိသေးပါ</p></div></td></tr>`;
      return;
    }
    tb.innerHTML=this.data.map(r=>`
      <tr>
        <td>${r['ဘဏ်']||'-'}</td>
        <td style="color:var(--green);font-weight:600;">${formatMoney(r['ငွေပမာဏ'])} ကျပ်</td>
        <td>${r['ရက်စွဲ']||'-'}</td>
        <td>${r['မှတ်ချက်']||'-'}</td>
      </tr>`).join('');
  },
  updateSummary() {
    setEl('bank-total',formatMoney(this.data.reduce((s,r)=>s+toNum(r['ငွေပမာဏ']),0))+' ကျပ်');
  },
  async submit() {
    const name=val('bank-name'),amount=val('bank-amount'),date=val('bank-date');
    if(!name||!amount||!date){showToast('ဖြည့်ရမည့် အချက်များ ဖြည့်ပါ ⚠️');return;}
    showToast('သိမ်းဆည်းနေသည်... ⏳');
    const res=await API.addRow('bank',{
      'ဘဏ်':''+name,'ငွေပမာဏ':''+amount,
      'ရက်စွဲ':''+date,'မှတ်ချက်':''+val('bank-note')
    });
    if(res?.status==='ok'){closeModal('bank-modal');showToast('သိမ်းဆည်းပြီး ✅');await this.load();}
  }
};

// ── Routing ────────────────────────────────────
const pages = { apartments:Apartments, goods:Goods, finance:Finance, property:Property, bank:Bank };

window.switchPage = function(name) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById(`page-${name}`)?.classList.add('active');
  document.querySelector(`[data-page="${name}"]`)?.classList.add('active');
  pages[name]?.load();
};

window.openModal  = openModal;
window.closeModal = closeModal;

// Page modules ကို global expose လုပ်မည်
window.Apartments = Apartments;
window.Goods      = Goods;
window.Finance    = Finance;
window.Property   = Property;
window.Bank       = Bank;

// Init
document.addEventListener('DOMContentLoaded', () => switchPage('apartments'));
