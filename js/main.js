/* ═══════════════════════════════════════════════════════════════
   VESPERWOOD · main.js
   Content injection · navigation · palette swatches · wedding-day
   string of lights · countdown · calendar files · reveals ·
   parallax · audio. Everything degrades gracefully:
   · no GSAP      → reveals still run (CSS + IntersectionObserver)
   · reduced motion → no scroll effects, countdown still runs
   · no JS at all → the page reads fully (see README)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var cfg = window.HEIRLOOM || {};
  var reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hasGsap = typeof window.gsap !== 'undefined';
  var hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';

  /* ══ 1 · CONTENT INJECTION (progressive enhancement) ═══════════
     The copy lives in index.html; config values refine it. If a
     [data-content] key exists in config below, its string
     replaces the text. Keys map to the config sections.           */
  function getConfigValue(path, source) {
    return path.split('.').reduce(function (value, key) {
      return value == null ? undefined : value[key];
    }, source || cfg);
  }

  function injectContent() {
    var c = cfg.couple || {}, w = cfg.wedding || {}, v = cfg.venue || {}, r = cfg.rsvp || {};
    var map = {
      'couple.names': c.namesLine,
      'couple.initials': c.initials,
      'couple.partner-one': c.partnerOne,
      'couple.partner-two': c.partnerTwo,
      'wedding.display': w.display,
      'wedding.words': w.words,
      'wedding.numerals': w.numerals,
      'wedding.zoneLabel': w.zoneLabel,
      'wedding.weekday': w.weekday,
      'wedding.month': w.month,
      'wedding.day': w.day,
      'wedding.year': w.year,
      'wedding.muhurat': w.muhurat,
      'wedding.muhuratLabel': w.muhuratLabel,
      'venue.name': v.name,
      'venue.address': v.address,
      'rsvp.deadline': r.deadline
    };
    Object.keys(map).forEach(function (key) {
      if (map[key] == null) return;
      document.querySelectorAll('[data-content="' + key + '"]').forEach(function (el) {
        el.textContent = map[key];
      });
    });
    document.querySelectorAll('[data-couple-initials]').forEach(function (el) {
      if (c.initials != null) el.textContent = c.initials;
    });
    document.querySelectorAll('[data-content^="content."]').forEach(function (el) {
      var value = getConfigValue(el.getAttribute('data-content'));
      if (value != null) el.textContent = value;
    });
    document.querySelectorAll('[data-placeholder-content]').forEach(function (el) {
      var value = getConfigValue(el.getAttribute('data-placeholder-content'));
      if (value != null) el.setAttribute('placeholder', value);
    });
    document.querySelectorAll('[data-aria-label-content]').forEach(function (el) {
      var value = getConfigValue(el.getAttribute('data-aria-label-content'));
      if (value != null) el.setAttribute('aria-label', value);
    });
    document.querySelectorAll('[data-meta-property], [data-meta-name]').forEach(function (el) {
      var value = getConfigValue(el.getAttribute('data-meta-content'));
      if (value == null) return;
      el.setAttribute('content', value);
    });
    var title = getConfigValue('content.pageTitle');
    if (typeof title === 'string' && title) document.title = title;
    var description = getConfigValue('content.pageDescription');
    var descriptionEl = document.querySelector('meta[name="description"]');
    if (descriptionEl && typeof description === 'string' && description) descriptionEl.content = description;
    applyTheme();
    applyFonts();
    /* the garden palette paints every SVG ornament through the
       same tokens the CSS reads — one recolour, whole suite. */
  }

  function applyPreviewConfig(nextConfig) {
    if (!nextConfig || typeof nextConfig !== 'object' || Array.isArray(nextConfig)) return;
    cfg = nextConfig;
    window.HEIRLOOM = cfg;
    injectContent();
    applyColorEdits();
    applyHiddenElements();
    renderPalette();
    renderMoments();
    initCountdown();
    initMapLink();
    updateGcalLink();
    document.dispatchEvent(new CustomEvent('heirloom:config-updated'));
  }
  window.HeirloomApplyPublishedConfig = applyPreviewConfig;

  var editableContentPaths = {
    'couple.names': 'couple.namesLine',
    'couple.initials': 'couple.initials',
    'couple.partner-one': 'couple.partnerOne',
    'couple.partner-two': 'couple.partnerTwo',
    'wedding.display': 'wedding.display',
    'wedding.words': 'wedding.words',
    'wedding.numerals': 'wedding.numerals',
    'wedding.zoneLabel': 'wedding.zoneLabel',
    'venue.name': 'venue.name',
    'venue.address': 'venue.address',
    'rsvp.deadline': 'rsvp.deadline'
  };

  function previewMessage(message) {
    if (window.parent === window) return;
    window.parent.postMessage(message, window.location.origin === 'null' ? '*' : window.location.origin);
  }

  function configPathForContent(key) {
    if (key.indexOf('content.nav') === 0 || key.indexOf('content.menu') === 0) return '';
    if (key.indexOf('content.') === 0) return key;
    return editableContentPaths[key] || '';
  }

  var fontFamilies = {
    editorial: {
      suranna: "'Suranna', serif",
      rozhaOne: "'Rozha One', serif",
      bodoni: "'Bodoni Moda', serif",
      playfair: "'Playfair Display', serif",
      dmSerif: "'DM Serif Display', serif",
      cormorant: "'Cormorant Garamond', serif",
      prata: "'Prata', serif",
      marcellus: "'Marcellus', serif",
      italiana: "'Italiana', serif",
      yatraOne: "'Yatra One', serif",
      libreCaslon: "'Libre Caslon Text', serif"
    },
    display: {
      eczar: "'Eczar', serif",
      marcellus: "'Marcellus', serif",
      cormorant: "'Cormorant Garamond', serif",
      ebGaramond: "'EB Garamond', serif",
      lora: "'Lora', serif",
      playfair: "'Playfair Display', serif",
      cardo: "'Cardo', serif",
      spectral: "'Spectral', serif",
      crimsonPro: "'Crimson Pro', serif",
      libreBaskerville: "'Libre Baskerville', serif"
    },
    script: {
      amita: "'Amita', cursive",
      pinyon: "'Pinyon Script', cursive",
      greatVibes: "'Great Vibes', cursive",
      allura: "'Allura', cursive",
      tangerine: "'Tangerine', cursive",
      parisienne: "'Parisienne', cursive",
      alexBrush: "'Alex Brush', cursive",
      mrsSaintDelafield: "'Mrs Saint Delafield', cursive",
      herrVonMuellerhoff: "'Herr Von Muellerhoff', cursive"
    },
    hand: {
      kalam: "'Kalam', cursive",
      laBelle: "'La Belle Aurore', cursive",
      caveat: "'Caveat', cursive",
      cedarville: "'Cedarville Cursive', cursive",
      shadowsIntoLight: "'Shadows Into Light', cursive",
      homemadeApple: "'Homemade Apple', cursive",
      nothingYouCouldDo: "'Nothing You Could Do', cursive"
    },
    body: {
      halant: "'Halant', serif",
      jost: "'Jost', sans-serif",
      spaceGrotesk: "'Space Grotesk', sans-serif",
      dmSans: "'DM Sans', sans-serif",
      lato: "'Lato', sans-serif",
      montserrat: "'Montserrat', sans-serif",
      karla: "'Karla', sans-serif",
      workSans: "'Work Sans', sans-serif",
      outfit: "'Outfit', sans-serif",
      sourceSans: "'Source Sans 3', sans-serif"
    }
  };

  function applyFonts() {
    var fonts = cfg.fonts || {};
    Object.keys(fontFamilies).forEach(function (role) {
      var choices = fontFamilies[role];
      var selected = choices[fonts[role]] || choices[{
        editorial: 'suranna',
        display: 'eczar',
        script: 'amita',
        hand: 'kalam',
        body: 'halant'
      }[role]];
      document.documentElement.style.setProperty('--font-' + role, selected);
    });
  }

  function colorSelectorFor(element) {
    var parts = [];
    var current = element;
    while (current && current !== document.body && current.parentElement) {
      var tag = current.tagName.toLowerCase();
      var index = 1;
      var sibling = current;
      while ((sibling = sibling.previousElementSibling)) {
        if (sibling.tagName.toLowerCase() === tag) index++;
      }
      parts.unshift(tag + ':nth-of-type(' + index + ')');
      current = current.parentElement;
    }
    return parts.length ? 'body > ' + parts.join(' > ') : '';
  }

  function colorToHex(color) {
    var match = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?/i);
    if (!match) return '';
    if (match[4] !== undefined && Number(match[4]) === 0) return '';
    return '#' + match.slice(1, 4).map(function (part) {
      return Number(part).toString(16).padStart(2, '0');
    }).join('').toUpperCase();
  }

  function backgroundToHex(styles) {
    return colorToHex(styles.backgroundColor);
  }

  /* The colour a region really shows: walk up until a painted
     background is found, so gradient sections still get a fair
     starting value in the editor's background tooltip.          */
  function effectiveBackground(element) {
    var current = element;
    while (current && current !== document.documentElement) {
      var hex = backgroundToHex(window.getComputedStyle(current));
      if (hex) return hex;
      current = current.parentElement;
    }
    return '#22231b';
  }

  /* Removable & recolourable pieces of the suite — keyed in HTML
     via data-element-key and hidden through config.hiddenElements. */
  var elementLabels = {
    'opening-tiles': 'The corner cascades',
    'opening-glow': 'Lantern glow',
    'opening-eyebrow': 'Opening introduction',
    'opening-names': 'Opening names',
    'envelope-shadow': 'Envelope shadow',
    'envelope-lace': 'The shamsa medallion',
    'envelope-letter': 'The letter inside',
    'envelope-flap': 'The silk flap',
    'envelope-stamps': 'The postage stamp',
    'envelope-seal': 'The gold dome seal',
    'envelope-address': 'The address plate',
    'opening-hint': 'Invitation hint',
    'open-button': 'Open button',
    'hero-card': 'The stage frame',
    'hero-mandala': 'The rangoli watermark',
    'hero-ganesha': 'The lotus Om invocation',
    'hero-cascade-tl': 'Inlay cascade · top left',
    'hero-cascade-tr': 'Inlay cascade · top right',
    'hero-spray-tl': 'Rose cluster · top left',
    'hero-spray-tr': 'Rose spray · top right',
    'hero-spray-bl': 'Petal drift · bottom left',
    'hero-spray-br': 'Petal drift · bottom right',
    'hero-bell-tl': 'Marigold toran · top left',
    'hero-bell-tr': 'Marigold toran · top right',
    'hero-jasmine-l': 'Peacock feather · left',
    'hero-jasmine-r': 'Peacock feather · right',
    'hero-pavilion': 'The sacred kalash',
    'hero-drape': 'The inlay spray',
    'hero-leaf-bl': 'Marble leaves · bottom left',
    'hero-leaf-br': 'Marble leaves · bottom right',
    'hero-diya-bl': 'Floating candle bowl · bottom left',
    'hero-diya-br': 'Rose cluster · bottom right',
    'hero-lotus-bl': 'The courtyard bowl',
    'hero-lotus-br': 'Rose cluster · bottom right',
    'folio-quote': 'Keepsake quote card',
    'story-caption': 'Story inscription',
    'story-note': 'Story handwritten note',
    'std-glow': 'Moonlit wash',
    'std-candles': 'The brass diya',
    'std-note': 'The gilded plate',
    'std-seal': 'Save-the-date seal',
    'detail-ceremony': 'Events · sangeet night',
    'detail-reception': 'Events · pheras',
    'detail-reply': 'Events · kindly reply',
    'detail-haldi': 'Events · haldi',
    'detail-mehndi': 'Events · mehndi',
    'detail-feast': 'Events · reception',
    'details-bouquet': 'The particulars',
    'palette-swatches': 'Palette swatches',
    'palette-dresscode': 'Dress code note',
    'day-words': 'The garland of moments',
    'venue-ornament': 'The golden mandap arch',
    'venue-arch': 'The marble arch',
    'rsvp-watermark': 'RSVP watermark',
    'rsvp-ornament': 'RSVP ornament',
    'countdown-clock': 'Countdown clock',
    'countdown-wreath': 'The shamsa rosette',
    'closing-swag': 'The moonlight plate',
    'closing-message': 'Closing message',
    'closing-seal': 'Closing seal',
    'footer-ornament': 'Footer ornament'
  };

  function keyFor(element) {
    var keyed = element && element.closest ? element.closest('[data-element-key]') : null;
    return keyed ? keyed.getAttribute('data-element-key') : '';
  }

  var appliedHiddenElements = [];

  function applyHiddenElements() {
    appliedHiddenElements.forEach(function (element) {
      element.style.removeProperty('display');
    });
    appliedHiddenElements = [];
    var hidden = cfg.hiddenElements;
    if (hidden && typeof hidden === 'object' && !Array.isArray(hidden)) {
      Object.keys(hidden).forEach(function (key) {
        if (!hidden[key]) return;
        var element;
        try {
          element = document.querySelector('[data-element-key="' + key + '"]');
        } catch (error) {
          return;
        }
        if (!element) return;
        appliedHiddenElements.push(element);
        element.style.setProperty('display', 'none', 'important');
      });
    }
    /* elements without a key are removed by their structural
       selector, so every clickable element can be taken out     */
    var hiddenSelectors = cfg.hiddenSelectors;
    if (hiddenSelectors && typeof hiddenSelectors === 'object' && !Array.isArray(hiddenSelectors)) {
      Object.keys(hiddenSelectors).forEach(function (selector) {
        if (!hiddenSelectors[selector] || typeof selector !== 'string' ||
            selector.indexOf('body > ') !== 0) return;
        var element;
        try {
          element = document.querySelector(selector);
        } catch (error) {
          return;
        }
        if (!element) return;
        appliedHiddenElements.push(element);
        element.style.setProperty('display', 'none', 'important');
      });
    }
  }

  function labelFor(element) {
    /* keyed pieces carry a clean catalogue name — prefer it over
       scraped text so the tooltip always reads well */
    var keyed = element && element.closest ? element.closest('[data-element-key]') : null;
    if (keyed) {
      var key = keyed.getAttribute('data-element-key');
      if (key && elementLabels[key]) return elementLabels[key];
    }
    var text = (element.textContent || '').trim().replace(/\s+/g, ' ');
    if (text) return text.slice(0, 40);
    var key = keyFor(element);
    if (key && elementLabels[key]) return elementLabels[key];
    if (element.getAttribute('aria-label')) return element.getAttribute('aria-label').slice(0, 40);
    var cls = (element.className || '').toString().trim().split(/\s+/)[0] || '';
    if (cls) return cls.replace(/[_.-]+/g, ' ').replace(/\b\w/g, function (ch) {
      return ch.toUpperCase();
    }).slice(0, 40);
    return element.tagName.toLowerCase();
  }

  function sendColorSelection(element, removeKey) {
    var selector = colorSelectorFor(element);
    if (!selector) return;
    var styles = window.getComputedStyle(element);
    var rect = element.getBoundingClientRect();
    var ownKey = (element.getAttribute && element.getAttribute('data-element-key')) || '';
    var key = removeKey || ownKey || keyFor(element);
    previewMessage({
      type: 'heirloom:element-selected',
      element: 'color',
      selector: selector,
      key: key,
      keySelf: !!(removeKey || ownKey),
      removable: true,
      label: labelFor(element),
      color: colorToHex(styles.color) || '#f8f5ec',
      backgroundColor: backgroundToHex(styles),
      anchor: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    });
  }

  function sendBackgroundSelection(element, x, y) {
    var selector = element === document.body ? 'body' : colorSelectorFor(element);
    if (!selector) return;
    var name = element.id ? '#' + element.id :
      (element.getAttribute('aria-label') || element.className || 'background')
        .toString().trim().replace(/\s+/g, ' ').split(' ').slice(0, 2).join(' ');
    previewMessage({
      type: 'heirloom:element-selected',
      element: 'background',
      selector: selector,
      key: '',
      removable: false,
      label: 'Background · ' + name,
      backgroundColor: effectiveBackground(element),
      anchor: { left: (x || 0) - 30, top: (y || 0) - 30, width: 60, height: 60 }
    });
  }

  var appliedColorElements = [];

  function applyColorEdits() {
    appliedColorElements.forEach(function (entry) {
      if (entry.color) entry.element.style.setProperty('color', entry.color, entry.colorPriority);
      else entry.element.style.removeProperty('color');
      if (entry.backgroundColor) {
        entry.element.style.setProperty('background-color', entry.backgroundColor, entry.backgroundPriority);
      } else {
        entry.element.style.removeProperty('background-color');
      }
    });
    appliedColorElements = [];
    var edits = cfg.colorEdits;
    if (!edits || typeof edits !== 'object' || Array.isArray(edits)) return;
    Object.keys(edits).forEach(function (selector) {
      var edit = edits[selector];
      if (!edit || typeof edit !== 'object') return;
      var element;
      try {
        element = document.querySelector(selector);
      } catch (error) {
        return;
      }
      if (!element) return;
      appliedColorElements.push({
        element: element,
        color: element.style.getPropertyValue('color'),
        colorPriority: element.style.getPropertyPriority('color'),
        backgroundColor: element.style.getPropertyValue('background-color'),
        backgroundPriority: element.style.getPropertyPriority('background-color')
      });
      if (/^#[0-9a-f]{6}$/i.test(edit.color || '')) {
        element.style.setProperty('color', edit.color, 'important');
      }
      if (/^#[0-9a-f]{6}$/i.test(edit.backgroundColor || '')) {
        element.style.setProperty('background-color', edit.backgroundColor, 'important');
        /* gradient images would cover the flat colour — clear them so
           the change is always visible in the preview and live page */
        element.style.setProperty('background-image', 'none', 'important');
      }
    });
  }

  var clearEditorSelection = null;

  function enableCanvasEditing() {
    if (window.parent === window) return;
    document.body.classList.add('editor-live');
    var activeText = null;
    var activeColorElement = null;
    var editorStyles = document.createElement('style');
    editorStyles.textContent =
      '[data-content][contenteditable="true"],[data-editor-path][contenteditable="true"]{' +
        'outline:1px dashed rgba(203,185,142,.95)!important;' +
        'outline-offset:4px!important;cursor:text!important;' +
      '}' +
      '.fleur-editor-color-selected{' +
        'outline:1px dashed rgba(203,185,142,.9)!important;' +
        'outline-offset:3px!important;' +
        'cursor:crosshair!important;' +
      '}' +
      /* decorative pieces ignore pointer events on the guest page —
         the editor needs to reach them for recolour & removal      */
      '.opening__florals,.opening__glow,.opening__watermark,' +
      '.envelope__seal-wrap,.envelope__stamps,.envelope__letter,.invitation-bloom,' +
      '.story-swag,.fc-quote__bloom,.story-keepsake,.std-candles,.std-glow,' +
      '.details-art__arch,.venue-lights,.closing-swag,.countdown-wreath{' +
        'pointer-events:auto!important;' +
      '}' +
      '[data-element-key]:not([contenteditable="true"]){cursor:crosshair;}';
    document.head.appendChild(editorStyles);

    function clearActive() {
      if (activeColorElement) activeColorElement.classList.remove('fleur-editor-color-selected');
      activeColorElement = null;
      if (activeText) activeText.blur();
      activeText = null;
    }

    clearEditorSelection = function () {
      if (activeText) {
        activeText.removeAttribute('contenteditable');
        activeText.classList.remove('fleur-editor-text-active');
      }
      clearActive();
    };

    document.addEventListener('click', function (event) {
      if (event.target.closest('#skip-intro')) {
        /* the skip link stays fully functional and never selectable —
           discard any open selection so the tooltip never lingers    */
        previewMessage({ type: 'heirloom:element-selected', element: 'none' });
        clearActive();
        return;
      }
      if (event.target.closest('input, textarea, select, label')) {
        previewMessage({ type: 'heirloom:element-selected', element: 'none' });
        clearActive();
        return;
      }

      var textElement = event.target.closest('[data-editor-path], [data-content]');
      var textPath = '';
      if (textElement) {
        textPath = textElement.getAttribute('data-editor-path') ||
          configPathForContent(textElement.getAttribute('data-content') || '');
        if (textElement.closest('[data-nav], #mobile-menu')) textPath = '';
      }
      if (textElement && textPath && typeof getConfigValue(textPath) === 'string' &&
          !textElement.closest('svg')) {
        /* SVG artwork text (the arch monogram & numerals) stays out
           of the text editor — it is recoloured or removed with its
           group instead, and follows the sidebar fields         */
        event.stopPropagation();
        if (textElement === activeText) return;
        if (textElement.closest('a, button')) event.preventDefault();
        if (activeText && activeText !== textElement) activeText.blur();
        if (activeColorElement && activeColorElement !== textElement) {
          activeColorElement.classList.remove('fleur-editor-color-selected');
        }
        activeColorElement = textElement;
        textElement.classList.add('fleur-editor-color-selected');
        activeText = textElement;
        textElement.contentEditable = 'true';
        textElement.classList.add('fleur-editor-text-active');
        textElement.focus();
        var selection = window.getSelection();
        if (selection) {
          var range = document.createRange();
          range.selectNodeContents(textElement);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
          if (textElement.hasAttribute('data-editor-placeholder')) {
            textElement.textContent = textElement.getAttribute('data-editor-placeholder');
            selection.selectNodeContents(textElement);
          }
        }
        var keyedOwner = keyFor(textElement);
        previewMessage({
          type: 'heirloom:element-selected',
          element: 'text',
          path: textPath,
          selector: colorSelectorFor(textElement),
          key: keyedOwner,
          keySelf: textElement.hasAttribute('data-element-key'),
          removable: !!keyedOwner,
          label: labelFor(textElement),
          color: colorToHex(window.getComputedStyle(textElement).color) || '#f8f5ec',
          backgroundColor: backgroundToHex(window.getComputedStyle(textElement)),
          anchor: (function () {
            var rect = textElement.getBoundingClientRect();
            return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
          })()
        });
        return;
      }

      /* card faces paint over their keyed wrappers — select the
         face itself for recolouring; Remove targets the keyed
         parent (passed as removeKey) so the whole piece comes away */
      var cardFace = event.target.closest('.envelope__pocket, .envelope__back, ' +
        '.envelope__flap-face, .envelope__flap-liner, .envelope__letter-inner');
      if (cardFace) {
        event.preventDefault();
        event.stopPropagation();
        clearActive();
        activeColorElement = cardFace;
        cardFace.classList.add('fleur-editor-color-selected');
        sendColorSelection(cardFace, keyFor(cardFace));
        return;
      }

      /* keyed decorative pieces (florals, seal, stamp, band…) —
         selectable for recolouring and removable                  */
      var keyedElement = event.target.closest('[data-element-key]');
      if (keyedElement && !keyedElement.closest('[data-nav], #mobile-menu')) {
        event.preventDefault();
        event.stopPropagation();
        clearActive();
        activeColorElement = keyedElement;
        keyedElement.classList.add('fleur-editor-color-selected');
        sendColorSelection(keyedElement);
        return;
      }

      var colorElement = event.target.closest('a, button, p, h1, h2, h3, h4, li, span, strong, em, blockquote, svg');
      if (colorElement && !colorElement.closest('[data-nav], #mobile-menu')) {
        event.preventDefault();
        event.stopPropagation();
        clearActive();
        activeColorElement = colorElement;
        colorElement.classList.add('fleur-editor-color-selected');
        sendColorSelection(colorElement);
        return;
      }

      /* blank space → select the surrounding background for recolouring */
      var backgroundElement = event.target.closest('section, header, footer') || document.body;
      sendBackgroundSelection(backgroundElement, event.clientX, event.clientY);
      clearActive();
    }, true);

    document.addEventListener('blur', function (event) {
      var element = event.target;
      if (!element.matches || !element.matches('[contenteditable="true"][data-content], [contenteditable="true"][data-editor-path]')) return;
      var path = element.getAttribute('data-editor-path') ||
        configPathForContent(element.getAttribute('data-content') || '');
      element.removeAttribute('contenteditable');
      element.classList.remove('fleur-editor-text-active');
      if (path) previewMessage({
        type: 'heirloom:element-edited',
        element: 'text',
        path: path,
        value: element.hasAttribute('data-editor-placeholder') &&
          element.textContent === element.getAttribute('data-editor-placeholder')
          ? ''
          : element.textContent
      });
      if (activeText === element) activeText = null;
    }, true);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && event.target.matches &&
          event.target.matches('[contenteditable="true"][data-content], [contenteditable="true"][data-editor-path]')) {
        event.preventDefault();
        event.target.blur();
      }
    }, true);
  }

  window.addEventListener('message', function (event) {
    if (window.parent === window || event.source !== window.parent || event.origin !== window.location.origin) return;
    var message = event.data;
    if (!message) return;
    if (message.type === 'heirloom:preview' && message.config) {
      var previewConfig = message.config;
      if (previewConfig.rsvp) previewConfig.rsvp.endpoint = '';
      applyPreviewConfig(previewConfig);
    }
    if (message.type === 'heirloom:clear-selection' && clearEditorSelection) {
      clearEditorSelection();
    }
  });

  var themePresets = {
    /* moods of the monument — the default taj (Mumtaz) suite:
       Makrana-ivory papers, warm umber dusk nights, carnelian accents,
       champagne-gold hairlines and a mother-of-pearl envelope,
       with jade and pale-jade greens. Night tones appear in the
       lapis interludes & the opening. The other moods remain
       available through the editor.                               */
    taj:      { burgundy: '#A3492A', deep: '#823A1F', wine: '#3A2C20', crimson: '#E2B995', champagne: '#B98A3E', soft: '#96702F', parchment: '#EFE7D6', ivory: '#F2EDE2', paper: '#FBF8F1', night: '#362A1E', nightDeep: '#261D14', olive: '#6E8265', oliveDeep: '#556A50', sage: '#A9B8A6', rose: '#E9D3C0', ink: '#33261B', inkSoft: '#6E5A46', charcoal: '#A99C8B' },
    /* moods of the darbar — the default noor (emerald) suite:
       every preset only re-tunes the same six roles, so the whole
       monument recolours as one fabric.                        */
    noor:     { burgundy: '#0E4B3A', deep: '#0A3A2D', wine: '#06281F', crimson: '#DCE8DD', champagne: '#C0A052', soft: '#96762F', parchment: '#EFE8D4', ivory: '#F4EFE2', paper: '#FCF9F0', night: '#0A2E24', nightDeep: '#051F18', olive: '#5F7A5A', oliveDeep: '#466042', sage: '#AEC0AA', rose: '#E7CDB4', ink: '#1F2A25', inkSoft: '#5C6B60', charcoal: '#9AA79B' },
    zafiran:  { burgundy: '#8C6B12', deep: '#6E5209', wine: '#4A3404', crimson: '#E3C268', champagne: '#D6A02E', soft: '#A87A1C', parchment: '#F8F0D8', ivory: '#FCF6E4', paper: '#FEFAEE', night: '#3A2B08', nightDeep: '#2A1D04', olive: '#6E6A2A', oliveDeep: '#524E1B', sage: '#B4B079', rose: '#EDD8A0', ink: '#2E2410', inkSoft: '#6E5C32', charcoal: '#A8986C' },
    marjan:   { burgundy: '#7A2E2E', deep: '#5E1F1F', wine: '#3E1212', crimson: '#D99292', champagne: '#C0A052', soft: '#96762F', parchment: '#F6E8DC', ivory: '#FAF1E4', paper: '#FEF8EE', night: '#38120F', nightDeep: '#260A08', olive: '#7A5A3A', oliveDeep: '#5C422A', sage: '#B49C86', rose: '#E8C0A8', ink: '#2C1410', inkSoft: '#6E4038', charcoal: '#A68478' },
    nilofar:  { burgundy: '#2A4A6B', deep: '#1C3854', wine: '#10233A', crimson: '#8FB4D9', champagne: '#C0A052', soft: '#96762F', parchment: '#E8EEF6', ivory: '#F1F4F9', paper: '#FAFBFE', night: '#0F1E33', nightDeep: '#081426', olive: '#3A6E6B', oliveDeep: '#285450', sage: '#8FB0B4', rose: '#C0D4E8', ink: '#121E2A', inkSoft: '#3E5468', charcoal: '#78889C' },
    /* moods of the wedding — the default (ivory rose) suite:
       porcelain ivory papers, antique champagne gold, dusty blush
       roses, sage eucalyptus and a deep rosewood dusk; every preset
       re-tunes the same six roles. */
    wedding:  { burgundy: '#9C6B5F', deep: '#7E5245', wine: '#3A2A25', crimson: '#E8CFC8', champagne: '#C2A468', soft: '#9C7F44', parchment: '#F3EDE0', ivory: '#F8F4EC', paper: '#FDFAF2', night: '#33231F', nightDeep: '#221511', olive: '#7D9470', oliveDeep: '#5C7350', sage: '#B3C2A4', rose: '#E9D5CE', ink: '#3C2C26', inkSoft: '#6E5A51', charcoal: '#AA9992' },
    vesperwood: { burgundy: '#20554A', deep: '#17423A', wine: '#0C2E28', crimson: '#D9E6DC', champagne: '#C9A24B', soft: '#7C6128', parchment: '#F1EDD9', ivory: '#F5F1E1', paper: '#FBF8EB', night: '#143830', nightDeep: '#0A1F1B', olive: '#466E56', oliveDeep: '#325341', sage: '#A8BFA9', rose: '#E4D8B8', ink: '#16332C', inkSoft: '#52695F', charcoal: '#96A89C' },
    zaytoon:  { burgundy: '#4A5E2A', deep: '#38491C', wine: '#24300E', crimson: '#A9C078', champagne: '#C6A24F', soft: '#9A7B36', parchment: '#F0F2DE', ivory: '#F6F8E8', paper: '#FCFEF2', night: '#1E2812', nightDeep: '#141C0A', olive: '#5E7A3A', oliveDeep: '#445C28', sage: '#A9B880', rose: '#D2E0A8', ink: '#1A2410', inkSoft: '#44582E', charcoal: '#8A9A6C' }
  };

  function applyTheme() {
    var themeName = Object.prototype.hasOwnProperty.call(themePresets, cfg.theme) ? cfg.theme : 'wedding';
    var colors = themePresets[themeName];
    var root = document.documentElement;
    root.style.setProperty('--burgundy', colors.burgundy);
    root.style.setProperty('--burgundy-deep', colors.deep);
    root.style.setProperty('--wine', colors.wine);
    root.style.setProperty('--crimson', colors.crimson);
    root.style.setProperty('--champagne', colors.champagne);
    root.style.setProperty('--champagne-soft', colors.soft);
    root.style.setProperty('--parchment', colors.parchment);
    root.style.setProperty('--ivory', colors.ivory);
    root.style.setProperty('--paper-raised', colors.paper);
    root.style.setProperty('--night', colors.night);
    root.style.setProperty('--night-deep', colors.nightDeep);
    root.style.setProperty('--olive', colors.olive);
    root.style.setProperty('--olive-deep', colors.oliveDeep);
    root.style.setProperty('--sage', colors.sage);
    root.style.setProperty('--rose', colors.rose);
    root.style.setProperty('--ink', colors.ink);
    root.style.setProperty('--ink-soft', colors.inkSoft);
    root.style.setProperty('--charcoal', colors.charcoal);
    root.style.setProperty('--shadow-seal',
      '0 4px 10px color-mix(in srgb, ' + colors.burgundy + ' 28%, transparent), ' +
      '0 14px 30px color-mix(in srgb, ' + colors.burgundy + ' 16%, transparent)');
    var customColors = cfg.themeColors || {};
    var colorRoles = {
      primary: ['--burgundy', '--burgundy-deep', '--crimson'],
      darkBackground: ['--wine', '--night', '--night-deep'],
      paper: ['--ivory', '--paper-raised', '--parchment'],
      accent: ['--champagne', '--champagne-soft', '--gold'],
      botanical: ['--olive', '--olive-deep', '--sage'],
      rose: ['--rose']
    };
    Object.keys(colorRoles).forEach(function (role) {
      var color = customColors[role];
      if (!/^#[0-9a-f]{6}$/i.test(color || '')) return;
      colorRoles[role].forEach(function (property) {
        root.style.setProperty(property, color);
      });
    });
    document.documentElement.dataset.theme = themeName;
    var themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) themeColorMeta.content = colors.night;
  }

  injectContent();
  applyColorEdits();
  applyHiddenElements();
  enableCanvasEditing();

  /* ══ 2 · NAVIGATION ════════════════════════════════════════════ */
  var nav = document.querySelector('[data-nav]');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Full-screen scene index (mobile menu) */
  var menuToggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  var menuClose = document.getElementById('menu-close');
  var menuPreviousOverflow = '';

  function setMenu(open) {
    if (!menu || !menuToggle) return;
    menu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      menuPreviousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      var first = menu.querySelector('a, button');
      if (first) first.focus();
      document.addEventListener('keydown', onMenuKeydown);
    } else {
      document.removeEventListener('keydown', onMenuKeydown);
      document.body.style.overflow = menuPreviousOverflow;
      menuToggle.focus();
    }
  }
  function onMenuKeydown(e) {
    if (e.key === 'Escape') {
      setMenu(false);
      return;
    }
    if (e.key !== 'Tab') return;
    var focusable = menu.querySelectorAll('a[href], button:not([disabled])');
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function () { setMenu(menu.hidden); });
    if (menuClose) menuClose.addEventListener('click', function () { setMenu(false); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }

  /* Active-section highlighting in the nav */
  (function initActiveLinks() {
    var ids = ['story', 'details', 'venue', 'rsvp'];
    var links = {};
    document.querySelectorAll('.nav__links a').forEach(function (a) {
      var id = (a.getAttribute('href') || '').replace('#', '');
      if (id) links[id] = a;
    });
    if (!('IntersectionObserver' in window)) return;
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          if (current && current !== link) current.removeAttribute('aria-current');
          link.setAttribute('aria-current', 'true');
          current = link;
        } else if (current === link) {
          link.removeAttribute('aria-current');
          current = null;
        }
      });
    }, { rootMargin: '-38% 0px -55% 0px' });
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  })();

  /* Sections become focusable targets for anchor navigation */
  document.querySelectorAll('main section[id]').forEach(function (s) {
    if (!s.hasAttribute('tabindex')) s.setAttribute('tabindex', '-1');
  });
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href.length < 2 || href === '#') return;
    a.addEventListener('click', function () {
      var target = document.getElementById(href.slice(1));
      if (target) {
        // native smooth scrolling happens; we only move focus for a11y
        window.setTimeout(function () {
          try { target.focus({ preventScroll: true }); } catch (e) {}
        }, 650);
      }
    });
  });

  /* ══ 3 · PALETTE SWATCHES ══════════════════════════════════════ */
  function renderPalette() {
    var list = document.getElementById('palette-swatches');
    if (!list) return;
    var swatches = Array.isArray(cfg.palette) ? cfg.palette : [];
    list.innerHTML = swatches.map(function (entry) {
      if (!entry || typeof entry !== 'object') return '';
      var color = typeof entry.color === 'string' ? entry.color : '';
      if (!/^#[0-9a-fA-F]{3,8}$/.test(color)) return '';
      var name = typeof entry.name === 'string' && entry.name.trim()
        ? entry.name.trim() : color;
      return '<li><span class="swatch" style="background:' + escapeHTML(color) + '"' +
        ' role="img" aria-label="' + escapeHTML(name) + '"></span>' +
        '<span class="swatch-name">' + escapeHTML(name) + '</span></li>';
    }).join('');
    list.hidden = !swatches.length;
  }
  renderPalette();

  /* ══ 4 · WEDDING-DAY STRING OF LIGHTS ═════════════════════════ */
  /* Each moment hangs from the cable like a warm bulb — one short
     word per moment, in order, with the glow doing the decoration. */
  function renderMoments() {
    var list = document.getElementById('day-words');
    var scene = document.getElementById('itinerary');
    var items = Array.isArray(cfg.moments) ? cfg.moments.map(function (word, index) {
      return { word: word, index: index };
    }).filter(function (item) {
      return typeof item.word === 'string' && item.word.trim();
    }) : [];
    if (!list) return;
    if (!items.length) {
      if (scene) scene.hidden = true;
      return;
    }
    if (scene) scene.hidden = false;
    list.innerHTML = items.map(function (item) {
      return '<li class="day-word reveal">' +
        '<span class="day-word__bulb" aria-hidden="true">' +
        '<svg viewBox="-12 -12 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M0 -8.8 L 2.3 -2.3 L 8.8 0 L 2.3 2.3 L 0 8.8 L -2.3 2.3 L -8.8 0 L -2.3 -2.3 Z"/><circle cx="0" cy="0" r="1.4"/></svg></span>' +
        '<span class="day-word__text" data-editor-path="moments.' + item.index + '">' +
        escapeHTML(item.word.trim()) + '</span></li>';
    }).join('');
    if (window.parent !== window) {
      list.querySelectorAll('.reveal').forEach(function (item) { item.classList.add('in-view'); });
    }
  }
  renderMoments();

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  /* ══ 5 · COUNTDOWN ═════════════════════════════════════════════ */
  var countdownTimer = null;
  var countdownVisibilityHandler = null;
  function initCountdown() {
    if (countdownTimer) window.clearInterval(countdownTimer);
    if (countdownVisibilityHandler) document.removeEventListener('visibilitychange', countdownVisibilityHandler);
    var box = document.getElementById('countdown-clock');
    var msg = document.getElementById('countdown-message');
    var summary = document.getElementById('countdown-summary');
    if (!box || !msg) return;

    var els = {
      d: box.querySelector('[data-cd-days]'),
      h: box.querySelector('[data-cd-hours]'),
      m: box.querySelector('[data-cd-mins]'),
      s: box.querySelector('[data-cd-secs]')
    };
    if (!els.d || !els.h || !els.m || !els.s) return;

    function showMsg(text) {
      box.hidden = true;
      msg.hidden = false;
      msg.textContent = text;
      if (summary) summary.textContent = '';
    }

    var raw = cfg.wedding && cfg.wedding.iso;
    var target = raw ? new Date(raw) : null;

    if (!target || isNaN(target.getTime())) {
      showMsg((cfg.countdown && cfg.countdown.invalidMessage) ||
              'See the details below for the full schedule.');
      return;
    }

    var lastDayText = '';

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      var diff = target.getTime() - Date.now();
      if (diff <= 0) {
        if (countdownTimer) window.clearInterval(countdownTimer);
        countdownTimer = null;
        showMsg((cfg.countdown && cfg.countdown.pastMessage) || 'The celebration has begun.');
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor(diff / 3600000) % 24;
      var m = Math.floor(diff / 60000) % 60;
      var s = Math.floor(diff / 1000) % 60;

      els.d.textContent = String(d);
      els.h.textContent = pad(h);
      els.m.textContent = pad(m);
      els.s.textContent = pad(s);

      var dayText = d + (d === 1 ? ' day' : ' days') + ' until the wedding';
      if (dayText !== lastDayText) {
        lastDayText = dayText;
        if (summary) summary.textContent = dayText;
      }
    }

    tick();
    box.hidden = false;
    msg.hidden = true;
    countdownTimer = window.setInterval(tick, 1000);

    /* pause the ticker while the tab is hidden */
    countdownVisibilityHandler = function () {
      if (document.hidden) {
        if (countdownTimer) { window.clearInterval(countdownTimer); countdownTimer = null; }
      } else if (!countdownTimer) {
        tick();
        countdownTimer = window.setInterval(tick, 1000);
      }
    };
    document.addEventListener('visibilitychange', countdownVisibilityHandler);
  }
  initCountdown();

  /* ══ 6 · VENUE MAP LINK ════════════════════════════════════════ */
  function initMapLink() {
    var link = document.getElementById('map-link');
    if (!link) return;
    var v = cfg.venue || {};
    var location = [v.name, v.address].filter(Boolean).join(', ');
    var query = v.mapsQuery || location || '';
    link.removeAttribute('href');
    if (typeof v.mapUrl === 'string' && /^https?:\/\//i.test(v.mapUrl)) {
      link.href = v.mapUrl;
    } else if (query) {
      link.href = 'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(query);
    }
    link.target = '_blank';
    link.rel = 'noopener';
  }
  initMapLink();

  /* ══ 7 · ADD TO CALENDAR (real .ics file + Google Calendar) ═════ */
  function padNum(n, len) { return String(n).padStart(len || 2, '0'); }
  function icsUTC(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear() + padNum(d.getUTCMonth() + 1) + padNum(d.getUTCDate()) +
           'T' + padNum(d.getUTCHours()) + padNum(d.getUTCMinutes()) + padNum(d.getUTCSeconds()) + 'Z';
  }
  function icsEscape(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,')
                    .replace(/\r?\n/g, '\\n');
  }

  function calendarData() {
    var w = cfg.wedding || {};
    var v = cfg.venue || {};
    var c = cfg.couple || {};
    var start = w.iso ? new Date(w.iso) : null;
    if (!start || isNaN(start.getTime())) return null;
    var end = w.endIso ? new Date(w.endIso) : new Date(start.getTime() + 4 * 3600000);
    if (isNaN(end.getTime()) || end.getTime() <= start.getTime()) return null;
    var title = w.eventTitle || ((c.namesLine || 'Our Wedding'));
    var location = [v.name, v.address].filter(Boolean).join(', ');
    var url = '';
    if (typeof v.mapUrl === 'string' && /^https?:\/\//i.test(v.mapUrl)) url = v.mapUrl;
    else if (v.mapsQuery || location) url = 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(v.mapsQuery || location);
    return { start: start, end: end, title: title, location: location, url: url };
  }

  var icsBtn = document.getElementById('ics-download');
  if (icsBtn) {
    icsBtn.addEventListener('click', function () {
      var data = calendarData();
      if (!data) return;
      var lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Kalyanam//Wedding Invitation//EN',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'UID:' + icsUTC(data.start.getTime()) + '-kalyanam@invitation',
        'DTSTAMP:' + icsUTC(Date.now()),
        'DTSTART:' + icsUTC(data.start.getTime()),
        'DTEND:' + icsUTC(data.end.getTime()),
        'SUMMARY:' + icsEscape(data.title),
        'LOCATION:' + icsEscape(data.location || 'To be announced'),
        'DESCRIPTION:' + icsEscape('With love, ' + (cfg.couple && cfg.couple.namesLine || '') +
                       '. See the invitation for details.' + (data.url ? '\\n' + data.url : '')),
        'END:VEVENT',
        'END:VCALENDAR'
      ];
      var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'wedding-invitation.ics';
      document.body.appendChild(a);
      a.click();
      window.setTimeout(function () {
        URL.revokeObjectURL(url);
        a.remove();
      }, 400);
    });
  }

  function updateGcalLink() {
    var gcalLink = document.getElementById('gcal-link');
    if (!gcalLink) return;
    var data = calendarData();
    gcalLink.removeAttribute('href');
    if (data) {
      var params = new URLSearchParams({
        action: 'TEMPLATE',
        text: data.title,
        dates: icsUTC(data.start.getTime()) + '/' + icsUTC(data.end.getTime()),
        location: data.location || '',
        details: 'See the invitation for details.' + (data.url ? ' ' + data.url : '')
      });
      gcalLink.href = 'https://calendar.google.com/calendar/render?' + params.toString();
      gcalLink.target = '_blank';
      gcalLink.rel = 'noopener';
    }
  }
  updateGcalLink();

  /* ══ 8 · SECTION REVEALS (CSS transitions + IntersectionObserver) ══ */
  (function initReveals() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    /* gentle natural stagger inside marked groups */
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      Array.prototype.forEach.call(group.querySelectorAll('.reveal'), function (el, i) {
        if (!el.style.getPropertyValue('--reveal-delay')) {
          el.style.setProperty('--reveal-delay', (i * 0.09).toFixed(2) + 's');
        }
      });
    });

    if (reducedQuery.matches || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });

    /* the fullscreen letter lives in the first viewport — its lower
       half falls inside the -8% band and would never cross the .12
       threshold, so the handover reveals it directly (same lesson
       as the arch windows: never let the observer eat the letter) */
    Array.prototype.forEach.call(
      document.querySelectorAll('.scene--hero .reveal'),
      function (el) { el.classList.add('in-view'); io.unobserve(el); }
    );
  })();

  /* ══ 9 · A BREATH OF PARALLAX (GSAP only, never essential) ═════ */
  function initParallax() {
    if (!hasST || reducedQuery.matches) return;
    try { gsap.registerPlugin(ScrollTrigger); } catch (e) { return; }
    document.querySelectorAll('[data-drift]').forEach(function (el) {
      gsap.fromTo(el, { yPercent: -3 }, {
        yPercent: 3, ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top bottom', end: 'bottom top', scrub: true
        }
      });
    });
  }
  if (document.body.classList.contains('intro-done')) initParallax();
  document.addEventListener('heirloom:intro-complete', initParallax);

  /* ══ 10 · OPTIONAL AMBIENT MUSIC ═══════════════════════════════ */
  (function initAudio() {
    var btn = document.getElementById('audio-toggle');
    if (!btn || !cfg.audio || !cfg.audio.src) return;

    var audio = new Audio();
    audio.src = cfg.audio.src;
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = 'none';

    var playing = false;
    btn.hidden = false;

    function render() {
      btn.innerHTML = playing
        ? '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18 6a8.5 8.5 0 0 1 0 12"/></svg>'
        : '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M22 9l-6 6"/><path d="M16 9l6 6"/></svg>';
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', playing ? 'Pause ambient music' : 'Play ambient music');
    }
    render();

    btn.addEventListener('click', function () {
      if (playing) {
        audio.pause();
        playing = false;
        render();
      } else {
        var p = audio.play();
        if (p && p.catch) {
          p.then(function () { playing = true; render(); })
           .catch(function () { render(); }); // browser policy — stays silent, stays honest
        } else {
          playing = true; render();
        }
      }
    });
  })();

  /* ══ 11 · REPLAY THE OPENING & RETURN TO TOP ═══════════════════ */
  var replayBtn = document.getElementById('replay-intro');
  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      if (typeof window.heirloomReplayIntro === 'function') {
        window.heirloomReplayIntro();
      } else {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
      }
    });
  }
  var topBtn = document.getElementById('back-to-top');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedQuery.matches ? 'auto' : 'smooth' });
    });
  }

})();
