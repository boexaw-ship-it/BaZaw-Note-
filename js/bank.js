const Bank = {
  data: [],

  async load() {
    const all = await API.getAll();
    this.data = all.bank || [];
    this.render();
    this.updateSummary();
  },

  render() {
    const tbody = document.getElementById('bank-tbody');
    if (!tbody) return;

    if (this.data.length === 0) {
      tbody.innerHTML = `
      <tr><td colspan="4">
      <div class="empty-state">
      <span class="empty-icon">🏦</span>
      <p>စာရင်း မရှိသေးပါ</p>
      </div></td></tr>`;
      return;
    }

    tbody.innerHTML = this.data.map(row => `
      <tr>
        <td>${row['ဘဏ်'] || '-'}</td>
        <td>${formatMoney(row['ငွေပမာဏ'])} ကျပ်</td>
        <td>${row['ရက်စွဲ'] || '-'}</td>
        <td>${row['မှတ်ချက်'] || '-'}</td>
      </tr>
    `).join('');
  },

  updateSummary() {
    const total = this.data.reduce((s, r) => s + toNum(r['ငွေပမာဏ']), 0);
    setEl('bank-total', formatMoney(total) + ' ကျပ်');
  },

  async submit() {
    const f = {
      name: val('bank-name'),
      amount: val('bank-amount'),
      date: val('bank-date'),
      note: val('bank-note')
    };

    if (!f.name || !f.amount || !f.date) {
      showToast('ဖြည့်ရမည့် အချက်များ ဖြည့်ပါ ⚠️');
      return;
    }

    showToast('သိမ်းဆည်းနေသည်... ⏳');

    const result = await API.addRow('Bank', [
      f.name,
      f.amount,
      f.date,
      f.note
    ]);

    if (result && result.status === 'ok') {
      closeModal('bank-modal');
      showToast('သိမ်းဆည်းပြီး ✅');
      await this.load();
    }
  }
};
