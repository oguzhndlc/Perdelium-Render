console.log('tinymce.js yüklendi');
console.log(window.tinymce);

document.addEventListener('DOMContentLoaded', function () {

  tinymce.init({
    selector: '#editor',

    /* === YÜKSEKLİK (Responsive) === */
    height: window.innerWidth < 768 ? 1000 : 600,
    min_height: window.innerWidth < 768 ? 1000 : 600,

    /* === TEMEL AYARLAR === */
    base_url: '/assets/tinymce',
    suffix: '.min',
    license_key: 'gpl',

    /* === DİL === */
    language: 'tr',

    /* === DARK UI === */
    skin: 'oxide-dark',

    /* === PLUGINLER === */
    plugins: `
      lists
      link
      image
      table
      code
      fullscreen
      autoresize
    `,

    /* === TOOLBAR === */
    toolbar: `
      undo redo |
      blocks |
      bold italic underline strikethrough |
      forecolor backcolor |
      bullist numlist |
      link image table |
      blockquote code |
      fullscreen
    `,

    toolbar_mode: 'sliding',

    /* === BLOK FORMATLARI === */
    block_formats: 'Paragraf=p; Başlık 1=h1; Başlık 2=h2; Başlık 3=h3',

    /* === İÇERİK STİLİ (iframe içi) === */
    content_style: `
      body {
        background-color: #0f0f14;
        color: #f5f5f5;
        font-family: "Segoe UI", system-ui, sans-serif;
        font-size: 16px;
        line-height: 1.8;
        padding: 24px;
      }

      h1, h2, h3 {
        color: #c9a24d;
        margin-top: 1.6em;
        font-weight: 600;
      }

      p {
        margin-bottom: 1em;
      }

      a {
        color: #8b0000;
        text-decoration: underline;
      }

      blockquote {
        border-left: 4px solid #8b0000;
        padding-left: 16px;
        color: #b0b0b0;
        font-style: italic;
        margin: 1.5em 0;
      }

      ul, ol {
        padding-left: 24px;
      }

      code {
        background: #1a1a22;
        padding: 4px 6px;
        border-radius: 4px;
        color: #c9a24d;
        font-family: monospace;
      }
    `,

    /* === GÖRSEL (base64 – şimdilik) === */
    images_upload_handler: function (blobInfo, success) {
      success(blobInfo.base64());
    },

    /* === UI AYARLARI === */
    branding: false,
    menubar: false,
    statusbar: true,
    resize: false,

    /* === İMLEÇ EN BAŞTA BAŞLASIN === */
    setup: function (editor) {
      editor.on('init', function () {
        editor.setContent('<p></p>');
        editor.focus();
        editor.selection.setCursorLocation(
          editor.getBody().firstChild,
          0
        );
      });
    }

  });

});
