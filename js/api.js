// ══════════════════════════════════════════════
//  api.js  —  Google Sheets connector
// ══════════════════════════════════════════════

const API = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxN17kWzZlZBQejzhpTvWfXJz7xXP0P_2x0vnWif9V3_-U3pdtUbs7Spzsb09QQ-RV2eg/exec',

  async getAll() {
    try {
      const res  = await fetch(`${this.SCRIPT_URL}?action=getAll`, {
        method: 'GET',
        mode: 'cors'
      });
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
      const res  = await fetch(this.SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',        // ← ဒါပဲ POST အတွက် အလုပ်ဖြစ်တယ်
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ sheet, row })
      });

      // no-cors မှာ response ဖတ်လို့မရဘူး — အောင်မြင်သည်ဟု ယူဆ
      showToast('သိမ်းဆည်းပြီး ✅');
      return { status: 'ok' };

    } catch (e) {
      console.error('POST error:', e);
      showToast('သိမ်းဆည်း မအောင်မြင်ဘူး ❌');
      return null;
    }
  }
};
