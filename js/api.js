// ══════════════════════════════════════════════
//  api.js — JSONP method (CORS ကျော်မည်)
// ══════════════════════════════════════════════

const API = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzkMRQ_D0gfYXElU2xUveRzpssHT9I02kCQidN5wxWW77nKKd24d8VZbIB9VyGndtNB/exec',

  // JSONP helper — script tag သုံးမည်
  _jsonp(url) {
    return new Promise((resolve, reject) => {
      const cbName = '_cb_' + Date.now();
      const script = document.createElement('script');

      window[cbName] = (data) => {
        resolve(data);
        delete window[cbName];
        script.remove();
      };

      script.onerror = () => {
        reject(new Error('JSONP failed'));
        delete window[cbName];
        script.remove();
      };

      script.src = url + '&callback=' + cbName;
      document.head.appendChild(script);

      setTimeout(() => {
        if (window[cbName]) {
          reject(new Error('JSONP timeout'));
          delete window[cbName];
          script.remove();
        }
      }, 10000);
    });
  },

  // GET — JSONP သုံးမည်
  async getAll() {
    try {
      const res = await this._jsonp(
        this.SCRIPT_URL + '?action=getAll'
      );
      return res.data || {};
    } catch (e) {
      console.error('GET error:', e);
      showToast('ချိတ်ဆက်မှု မအောင်မြင်ဘူး ❌');
      return {};
    }
  },

  // POST — JSONP နဲ့ GET param သုံးမည်
  async addRow(sheet, row) {
    try {
      const rowJson = encodeURIComponent(JSON.stringify(row));
      const url = this.SCRIPT_URL
        + '?action=addRow'
        + '&sheet=' + encodeURIComponent(sheet)
        + '&row='   + rowJson;

      const res = await this._jsonp(url);
      return res;
    } catch (e) {
      console.error('POST error:', e);
      showToast('သိမ်းဆည်း မအောင်မြင်ဘူး ❌');
      return null;
    }
  }
};
