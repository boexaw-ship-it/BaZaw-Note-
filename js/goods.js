// ══════════════════════════════════════════════
//  goods.js  —  Page 2: ပစ္စည်းအဝယ်အရောင်း
// ══════════════════════════════════════════════

const Goods = {
  data: [],

  async load() {
    const all = await API.getAll();
    this.data = all.goods || [];
    this.render();
    this.updateSummary();
  },

  render() {
    const tbody = document.getElementById('goods-tbody');
    if (!tbody) return;

    if (this.data.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="6">
          <div class="empty-state">
            <span class="empty-icon">📦</span>
            <p>စာရင်း မရှိသေးပါ</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = this.data.map(row => {
      const isBuy = row['အဝယ်/အရောင်း'] === 'အဝယ်';
      return `
        <tr>
          <td>${row['ပစ္စည်းအမည်'] || '-'}</td>
          <td>${row['အမျိုးအစား'] || '-'}</td>
          <td>${row['ပမာဏ'] || '-'}</td>
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
    const profit    = totalSell - totalBuy;

    setEl('goods-total-buy',    formatMoney(totalBuy)  + ' ကျပ်');
    setEl('goods-total-sell',   formatMoney(totalSell) + ' ကျပ်');
    setEl('goods-total-profit', formatMoney(profit)    + ' ကျပ်');
  },

  async submit() {
    const f = {
      name:   val('goods-name'),
      cat:    val('goods-cat'),
      qty:    val('goods-qty'),
      price:  val('goods-price'),
      type:   val('goods-type'),
      date:   val('goods-date'),
      note:   val('goods-note'),
    };

    if (!f.name || !f.price || !f.date) {
      showToast('ဖြည့်ရမည့် အချက်များ ဖြည့်ပါ ⚠️'); return;
    }

    showToast('သိမ်းဆည်းနေသည်... ⏳');
    const result = await API.addRow('Goods', [
      f.name, f.cat, f.qty, f.price, f.type, f.date, f.note
    ]);

    if (result && result.status === 'ok') {
      closeModal('goods-modal');
      showToast('သိမ်းဆည်းပြီး ✅');
      await this.load();
    }
  }
};
