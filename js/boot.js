(function () {
  'use strict';

  var inviteId = new URLSearchParams(window.location.search).get('invite') || '';
  var revision = 0;
  var endpoint = '/api/publish';
  var readyTimer = null;

  window.addEventListener('message', function (event) {
    if (event.source === window.parent && event.data &&
        event.data.type === 'heirloom:preview' && readyTimer) {
      window.clearInterval(readyTimer);
      readyTimer = null;
    }
  });

  function announcePreviewReady() {
    if (window.parent === window) return;
    window.parent.postMessage({ type: 'heirloom:ready' },
      window.location.origin === 'null' ? '*' : window.location.origin);
    if (!readyTimer) {
      var attempts = 0;
      readyTimer = window.setInterval(function () {
        attempts += 1;
        if (attempts >= 20) {
          window.clearInterval(readyTimer);
          readyTimer = null;
        } else {
          window.parent.postMessage({ type: 'heirloom:ready' },
            window.location.origin === 'null' ? '*' : window.location.origin);
        }
      }, 500);
    }
  }

  function showLoadError(message) {
    var notice = document.createElement('div');
    notice.setAttribute('role', 'alert');
    notice.textContent = message;
    notice.style.cssText = 'position:fixed;z-index:99999;inset:0;display:grid;place-items:center;padding:2rem;background:#08242C;color:#f7f4ee;font:18px Georgia,serif;text-align:center';
    document.body.appendChild(notice);
    document.body.classList.remove('intro-pending');
  }

  function loadScript(path) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = path;
      script.onload = resolve;
      script.onerror = function () { reject(new Error('Could not load ' + path)); };
      document.body.appendChild(script);
    });
  }

  function requestPublishedConfig() {
    return fetch(endpoint + '?action=load&id=' + encodeURIComponent(inviteId), {
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    }).then(function (response) {
      if (!response.ok) throw new Error('This invitation link is unavailable or has not been published.');
      return response.json();
    });
  }

  function requestRevision() {
    return fetch(endpoint + '?action=version&id=' + encodeURIComponent(inviteId), {
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    }).then(function (response) {
      if (!response.ok) throw new Error('Could not check invitation updates.');
      return response.json();
    });
  }

  function pollPublishedConfig() {
    if (!inviteId) return;
    /* Poll briskly at first (the couple may still be editing), then settle
       into a slow heartbeat. The poll sleeps whenever the tab is hidden —
       a background tab must never cost battery or bandwidth. */
    var ticks = 0;
    (function tick() {
      var delay = ticks < 60 ? 3000 : 30000;
      window.setTimeout(tick, delay);
      if (document.hidden) return;
      ticks += 1;
      requestRevision().then(function (version) {
        if (version.revision <= revision) return null;
        return requestPublishedConfig().then(function (result) {
          revision = result.revision;
          if (typeof window.HeirloomApplyPublishedConfig === 'function') {
            window.HeirloomApplyPublishedConfig(result.config);
          }
          return null;
        });
      }).catch(function () {
        // Keep the last successfully loaded version if a poll is temporarily unavailable.
      });
    })();
  }

  function startSite() {
    return loadScript('js/config.js').then(function () {
      /* The editor's "See it as a guest" link opens this page with
         ?preview=1 — show the couple's latest edits from this browser
         instead of the sample, so the preview is always honest.      */
      if (!inviteId && new URLSearchParams(window.location.search).get('preview')) {
        try {
          var stored = window.localStorage.getItem('heirloom-preview-config');
          if (stored) {
            var parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object') window.HEIRLOOM = parsed;
          }
        } catch (error) { /* fall back to the sample invitation */ }
      }
      if (!inviteId) return null;
      return requestPublishedConfig().then(function (result) {
        revision = result.revision;
        window.HEIRLOOM = result.config;
      });
    }).then(function () {
      return loadScript('js/envelope.js');
    }).then(function () {
      return loadScript('js/main.js');
    }).then(function () {
      return loadScript('js/rsvp.js');
    }).then(function () {
      pollPublishedConfig();
      announcePreviewReady();
    });
  }

  startSite().catch(function (error) {
    showLoadError(error.message || 'The invitation could not be loaded. Please try again later.');
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'heirloom:load-error',
        message: error.message || 'The invitation could not be loaded.'
      }, window.location.origin === 'null' ? '*' : window.location.origin);
    }
  });
})();
