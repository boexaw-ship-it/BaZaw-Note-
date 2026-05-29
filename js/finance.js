// ══════════════════════════════════════════════
//  finance.js  —  Page 3: ငွေအဝင်အထွက်
// ══════════════════════════════════════════════

const Finance = {
  data: [],

  async load() {
    const all = await API.getAll();
    this.data = all.finance || [];
    this.render();
    this.updateSummary();
  },

  render() {
    const tbody = document.getElementById('finance-tbody');
    if (!tbody) return;

    if (this.data.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="5">
          <div class="empty-state">
            <span class="empty-icon">💰</span>
            <p>စာရင်း မရှိသေးပါ</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = this.data.map(row => {
      const isIn = row['အမျိုးအစား'] === 'ငွေဝင်';
      return `
        <tr>
          <td>
            <span class="badge ${isIn ? 'badge-green' : 'badge-red'}">
              ${row['အမျိုးအစား'] || '-'}
            </span>
          </td>
          <td style="color:${isIn ? 'var(--green)' : 'var(--red)'};font-weight:600;">
            ${isIn ? '+' : '-'}${formatMoney(row['ငွေပမာဏ'])} ကျပ်
          </td>
          <td>${row['ရင်းမြစ်'] || '-'}</td>
          <td>${row['ရက်စွဲ'] || '-'}</td>
          <td>${row['မှတ်ချက်'] || '-'}</td>
        </tr>`;
    }).join('');
  },

  updateSummary() {
    const incomes  = this.data.filter(r => r['အမျိုးအစား'] === 'ငွေဝင်');
    const expenses = this.data.filter(r => r['အမျိုးအစား'] === 'ငွေထွက်');

    const totalIn  = incomes.reduce((s, r)  => s + toNum(r['ငွေပမာဏ']), 0);
    const totalOut = expenses.reduce((s, r) => s + toNum(r['ငွေပမာဏ']), 0);
    const balance  = totalIn - totalOut;

    setEl('fin-total-in',      formatMoney(totalIn)  + ' ကျပ်');
    setEl('fin-total-out',     formatMoney(totalOut) + ' ကျပ်');
    setEl('fin-balance',       formatMoney(balance)  + ' ကျပ်');

    const el = document.getElementById('fin-balance');
    if (el) el.style.color = balance >= 0 ? 'var(--green)' : 'var(--red)';
  },

  async submit() {
    const f = {
      type:   val('fin-type'),
      amount: val('fin-amount'),
      source: val('fin-source'),
      date:   val('fin-date'),
      note:   val('fin-note'),
    };

    if (!f.type || !f.amount || !f.date) {
      showToast('ဖြည့်ရမည့် အချက်များ ဖြည့်ပါ ⚠️'); return;
    }

    showToast('သိမ်းဆည်းနေသည်... ⏳');
    const result = await API.addRow('Finance', [
      f.type, f.amount, f.source, f.date, f.note
    ]);

    if (result && result.status === 'ok') {
      closeModal('fin-modal');
      showToast('သိမ်းဆည်းပြီး ✅');
      await this.load();
    }
  }
};
