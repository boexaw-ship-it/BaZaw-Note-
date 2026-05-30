// ══════════════════════════════════════════════
//  api.js  —  Google Sheets connector
//  URL ရပြီဆိုရင် SCRIPT_URL ထဲ ထည့်ပါ
// ══════════════════════════════════════════════

const API = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzVO34eS4Hc_1lmhJW5mBblAJombYNTi5eDJU15ald77Vau5LkVV-vgWY7bgQQUezYGlw/exec',

  normalizeData(data) {
    const source = data && typeof data === 'object' ? data : {};
    const pick = (...names) => {
      for (const name of names) {
        if (Array.isArray(source[name])) return source[name];
      }
      return [];
    };

    return {
      apartments: pick('apartments', 'Apartments', 'Apartment'),
      goods: pick('goods', 'Goods'),
      finance: pick('finance', 'Finance'),
      property: pick('property', 'Property'),
      bank: pick('bank', 'Bank')
    };
  },

  async getAll() {
    try {
      const res = await fetch(`${this.SCRIPT_URL}?action=getAll`);
      const json = await res.json();
      return this.normalizeData(json.data || {});
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
