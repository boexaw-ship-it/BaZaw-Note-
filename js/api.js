// ══════════════════════════════════════════════
//  api.js  —  Google Sheets connector
//  URL ရပြီဆိုရင် SCRIPT_URL ထဲ ထည့်ပါ
// ══════════════════════════════════════════════

const API = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyb3MJQ1xfP_fTZ_ziwimjiwLE-L7boA8TsXqlMPn4nArqG7KGvJnc7aMs9qsbgV5_CJg/exec',

  async getAll() {
    try {
      const res = await fetch(`${this.SCRIPT_URL}?action=getAll`);
      const json = await res.json();
      return json.data || {};
    } catch (e) {
      console.error('GET error:', e);
      showToast('ချိတ်ဆက်မှု မအောင်မြင်ဘူး ❌');
      return {};
    }
  },

  async addRow(sheet, row) {
    try {
      const res = await fetch(this.SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ sheet, row })
      });
      const json = await res.json();
      return json;
    } catch (e) {
      console.error('POST error:', e);
      showToast('သိမ်းဆည်း မအောင်မြင်ဘူး ❌');
      return null;
    }
  }
};
