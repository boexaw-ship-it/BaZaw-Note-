// ══════════════════════════════════════════════
//  api.js — JSONP + cache busting
// ══════════════════════════════════════════════

const API = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyaXUlO4AMe6ccrz40Fb0iHYKRYCaAKESMiQ14qK42NQEZOJJKFilE4E5_tDZQ1bchq/exec',

  _jsonp(url) {
    return new Promise((resolve, reject) => {
      const cbName = '_cb_' + Date.now() + '_' + Math.random().toString(36).slice(2);
      const script = document.createElement('script');

      window[cbName] = (data) => {
        resolve(data);
        delete window[cbName];
        document.head.removeChild(script);
      };

      script.onerror = () => {
        reject(new Error('JSONP failed'));
        delete window[cbName];
        if (script.parentNode) document.head.removeChild(script);
      };

      // cache busting — t= ထည့်ထားတယ်
      const sep = url.includes('?') ? '&' : '?';
      script.src = url + sep + 'callback=' + cbName + '&t=' + Date.now();
      document.head.appendChild(script);

      setTimeout(() => {
        if (window[cbName]) {
          reject(new Error('Timeout'));
          delete window[cbName];
          if (script.parentNode) document.head.removeChild(script);
        }
      }, 15000); // 15s အထိ စောင့်မည်
    });
  },

  async getAll() {
    try {
      const res = await this._jsonp(this.SCRIPT_URL + '?action=getAll');
      return res.data || {};
    } catch (e) {
      console.error('GET error:', e);
      // toast မပြဘူး — page load တိုင်း error မပြချင်ဘူး
      return {};
    }
  },

  async addRow(sheet, row) {
    try {
      const rowJson = encodeURIComponent(JSON.stringify(row));
      const url = this.SCRIPT_URL
        + '?action=addRow'
        + '&sheet=' + encodeURIComponent(sheet)
        + '&row='   + rowJson;
      const res = await this._jsonp(url);
      if (res && (res.status === 'ok' || res.data?.status === 'ok')) {
        return { status: 'ok' };
      }
      return res;
    } catch (e) {
      console.error('addRow error:', e);
      showToast('သိမ်းဆည်း မအောင်မြင်ဘူး ❌');
      return null;
    }
  }
};
