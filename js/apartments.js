// ══════════════════════════════════════════════
//  apartments.js  —  Page 1: တိုက်ခန်းအငှား
// ══════════════════════════════════════════════

const Apartments = {
  data: [],

  async load() {
    const all = await API.getAll();
    this.data = all.apartments || [];
    this.render();
    this.updateSummary();
  },

  render() {
    const tbody = document.getElementById('apt-tbody');
    if (!tbody) return;

    if (this.data.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="6">
          <div class="empty-state">
            <span class="empty-icon">🏢</span>
            <p>စာရင်း မရှိသေးပါ</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = this.data.map(row => `
      <tr>
        <td>${row['တိုက်ခန်း'] || row['ခန်းနံပါတ်'] || '-'}</td>
        <td>${row['အငှားရသူ'] || '-'}</td>
        <td class="text-right" style="color:var(--gold);font-weight:600;">
          ${formatMoney(row['လချုပ်ကြေး'] || row['အငှားနှုန်း'])} ကျပ်
        </td>
        <td>${row['Start Date'] || '-'}</td>
        <td>${row['End Date'] || '-'}</td>
        <td>${row['မှတ်ချက်'] || '-'}</td>
      </tr>`).join('');
  },

  updateSummary() {
    const totalRent = this.data.reduce((s, r) => s + toNum(r['လချုပ်ကြေး'] || r['အငှားနှုန်း']), 0);
    const totalUnits = this.data.length;

    setEl('apt-total-rent', formatMoney(totalRent) + ' ကျပ်');
    setEl('apt-total-units', totalUnits + ' ခန်း');
    setEl('apt-active-contracts', totalUnits + ' ခု');
  },

  async submit() {
    const f = {
      room: val('apt-room'),
      tenant: val('apt-tenant'),
      rent: val('apt-rent'),
      startDate: val('apt-start-date'),
      endDate: val('apt-end-date'),
      note: val('apt-note'),
    };

    if (!f.room || !f.rent || !f.startDate || !f.endDate) {
      showToast('ဖြည့်ရမည့် အချက်များ ဖြည့်ပါ ⚠️'); return;
    }

    showToast('သိမ်းဆည်းနေသည်... ⏳');
    const result = await API.addRow('Apartments', [
      f.room,
      f.tenant,
      f.rent,
      f.startDate,
      f.endDate,
      f.note
    ]);

    if (result && result.status === 'ok') {
      closeModal('apt-modal');
      showToast('သိမ်းဆည်းပြီး ✅');
      await this.load();
    }
  }
};
