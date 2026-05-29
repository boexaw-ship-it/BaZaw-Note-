// ══════════════════════════════════════════════
//  property.js  —  Page 4: တိုက်/အိမ်/ကားအရောင်းအဝယ်
// ══════════════════════════════════════════════

const Property = {
  data: [],

  async load() {
    const all = await API.getAll();
    this.data = all.property || [];
    this.render();
    this.updateSummary();
  },

  render() {
    const tbody = document.getElementById('prop-tbody');
    if (!tbody) return;

    if (this.data.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="5">
          <div class="empty-state">
            <span class="empty-icon">🏠</span>
            <p>စာရင်း မရှိသေးပါ</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = this.data.map(row => {
      const isBuy = row['အဝယ်/အရောင်း'] === 'အဝယ်';
      const typeIcon = {
        'တိုက်ခန်း': '🏢', 'အိမ်': '🏠', 'ကား': '🚗', 'မြေ': '🌍'
      }[row['အမျိုးအစား']] || '📋';

      return `
        <tr>
          <td>${typeIcon} ${row['အမျိုးအစား'] || '-'}</td>
          <td>${row['ဖော်ပြချက်'] || '-'}</td>
          <td style="color:var(--gold);font-weight:600;">
            ${formatMoney(row['တန်ဖိုး'])} ကျပ်
          </td>
          <td>
            <span class="badge ${isBuy ? 'badge-red' : 'badge-green'}">
              ${row['အဝယ်/အရောင်း'] || '-'}
            </span>
          </td>
          <td>${row['ရက်စွဲ'] || '-'}</td>
        </tr>`;
    }).join('');
  },

  updateSummary() {
    const buys  = this.data.filter(r => r['အဝယ်/အရောင်း'] === 'အဝယ်');
    const sells = this.data.filter(r => r['အဝယ်/အရောင်း'] === 'အရောင်း');

    const totalBuy  = buys.reduce((s, r)  => s + toNum(r['တန်ဖိုး']), 0);
    const totalSell = sells.reduce((s, r) => s + toNum(r['တန်ဖိုး']), 0);
    const net       = totalSell - totalBuy;

    setEl('prop-total-buy',  formatMoney(totalBuy)  + ' ကျပ်');
    setEl('prop-total-sell', formatMoney(totalSell) + ' ကျပ်');
    setEl('prop-net',        formatMoney(net)       + ' ကျပ်');

    const el = document.getElementById('prop-net');
    if (el) el.style.color = net >= 0 ? 'var(--green)' : 'var(--red)';
  },

  async submit() {
    const f = {
      type:  val('prop-type'),
      desc:  val('prop-desc'),
      price: val('prop-price'),
      deal:  val('prop-deal'),
      date:  val('prop-date'),
      note:  val('prop-note'),
    };

    if (!f.type || !f.price || !f.date) {
      showToast('ဖြည့်ရမည့် အချက်များ ဖြည့်ပါ ⚠️'); return;
    }

    showToast('သိမ်းဆည်းနေသည်... ⏳');
    const result = await API.addRow('Property', [
      f.type, f.desc, f.price, f.deal, f.date, f.note
    ]);

    if (result && result.status === 'ok') {
      closeModal('prop-modal');
      showToast('သိမ်းဆည်းပြီး ✅');
      await this.load();
    }
  }
};
