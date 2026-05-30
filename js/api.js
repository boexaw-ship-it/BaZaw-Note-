// ══════════════════════════════════════════════
//  api.js  —  Google Sheets connector
// ══════════════════════════════════════════════

const API = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwMwybSrVxr2W-19U2hnvqvoYFKInNvNTR4EFvyKdRwefRTr3CdklCbthqbK_fL-cfmGg/exec',

  // GET — no-cors မသုံးဘူး၊ redirect follow လုပ်မည်
  async getAll() {
    try {
      const url = this.SCRIPT_URL + '?action=getAll';
      const res = await fetch(url, {
        redirect: 'follow'
      });
      const json = await res.json();
      return json.data || {};
    } catch (e) {
      console.error('GET error:', e);
      showToast('ချိတ်ဆက်မှု မအောင်မြင်ဘူး ❌');
      return {};
    }
  },

  // POST — no-cors သုံးမည် (CORS bypass)
  async addRow(sheet, row) {
    try {
      await fetch(this.SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        body:    JSON.stringify({ sheet, row })
      });
      // no-cors မှာ response မဖတ်နိုင်ဘူး — 2s စောင့်ပြီး reload
      await new Promise(r => setTimeout(r, 2000));
      return { status: 'ok' };
    } catch (e) {
      console.error('POST error:', e);
      showToast('သိမ်းဆည်း မအောင်မြင်ဘူး ❌');
      return null;
    }
  }
};
