// PJAX navigation for smooth page transitions
(function() {
  'use strict';

  // Check if browser supports History API
  if (!window.history || !window.history.pushState) {
    console.log('PJAX: Browser does not support History API');
    return;
  }

  var isNavigating = false;
  var cache = {};

  // Fetch page content via AJAX
  function fetchPage(url) {
    // Check cache first
    if (cache[url]) {
      return Promise.resolve(cache[url]);
    }

    return fetch(url, {
      headers: {
        'X-PJAX': 'true'
      }
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(function(html) {
      // Cache the result
      cache[url] = html;
      return html;
    });
  }

  // Update page content
  function updateContent(html, url) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');

    // Update main content
    var newContent = doc.querySelector('#body-inner');
    var oldContent = document.querySelector('#body-inner');

    if (newContent && oldContent) {
      // Fade out
      oldContent.style.opacity = '0';
      oldContent.style.transition = 'opacity 0.2s ease';

      setTimeout(function() {
        oldContent.innerHTML = newContent.innerHTML;

        // Update title
        var newTitle = doc.querySelector('title');
        if (newTitle) {
          document.title = newTitle.textContent;
        }

        // Update active menu item
        updateActiveMenuItem(url);

        // Scroll to top
        window.scrollTo(0, 0);

        // Fade in
        oldContent.style.opacity = '1';

        // Re-initialize features
        reinitializeFeatures();

        // Store visited page
        sessionStorage.setItem($('body').data('url'), 1);
        $('[data-nav-id="' + url + '"]').addClass('visited');

      }, 200);
    }
  }

  // Update active menu item
  function updateActiveMenuItem(url) {
    // Remove all active classes
    $('#sidebar .dd-item').removeClass('active');

    // Add active class to current page
    var $menuItem = $('#sidebar [data-nav-id="' + url + '"]');
    $menuItem.addClass('active');

    // Expand parent menu items
    $menuItem.parents('.dd-item').each(function() {
      $(this).addClass('parent');
      $(this).children('ul').show();
    });
  }

  // Reinitialize features after content load
  function reinitializeFeatures() {
    // Reinitialize syntax highlighting
    if (window.hljs) {
      document.querySelectorAll('pre code').forEach(function(block) {
        hljs.highlightBlock(block);
      });
    }

    // Reinitialize clipboard
    if (window.ClipboardJS) {
      $('code').each(function() {
        var code = $(this);
        var text = code.text();
        if (text.length > 5 && !code.next('.copy-to-clipboard').length) {
          code.after('<span class="copy-to-clipboard" title="Copy to clipboard" />');
        }
      });
    }

    // Reinitialize anchor links
    $('#body-inner a:not(:has(img)):not(.btn):not(a[rel="footnote"])').addClass('highlight');

    // Reinitialize lightbox
    if (window.featherlight) {
      $('a[rel="lightbox"]').featherlight({
        root: 'section#body'
      });
    }

    // Update body data-url
    var currentUrl = window.location.pathname;
    $('body').attr('data-url', currentUrl);
  }

  // Handle link clicks
  function handleLinkClick(e) {
    // Ignore if:
    // - Middle click, ctrl/cmd click, or new tab
    // - External links
    // - Anchor links
    // - Already navigating
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) {
      return;
    }

    var $link = $(e.currentTarget);
    var href = $link.attr('href');

    // Skip if no href or it's an anchor
    if (!href || href.charAt(0) === '#') {
      return;
    }

    // Skip external links
    if (href.indexOf('://') > -1 && href.indexOf(window.location.host) === -1) {
      return;
    }

    // Skip if already navigating
    if (isNavigating) {
      return;
    }

    // Get full URL
    var url = href;
    if (url.charAt(0) !== '/') {
      // Relative URL - resolve it
      var a = document.createElement('a');
      a.href = url;
      url = a.pathname;
    }

    // Prevent default navigation
    e.preventDefault();
    isNavigating = true;

    // Add loading class
    $('body').addClass('pjax-loading');

    // Fetch and update content
    fetchPage(url)
      .then(function(html) {
        updateContent(html, url);
        history.pushState({ url: url }, '', url);
        isNavigating = false;
        $('body').removeClass('pjax-loading');
      })
      .catch(function(error) {
        console.error('PJAX navigation failed:', error);
        // Fallback to regular navigation
        window.location.href = url;
        isNavigating = false;
        $('body').removeClass('pjax-loading');
      });
  }

  // Handle browser back/forward
  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.url) {
      var url = e.state.url;

      $('body').addClass('pjax-loading');

      fetchPage(url)
        .then(function(html) {
          updateContent(html, url);
          $('body').removeClass('pjax-loading');
        })
        .catch(function(error) {
          console.error('PJAX popstate failed:', error);
          window.location.href = url;
          $('body').removeClass('pjax-loading');
        });
    }
  });

  // Initialize PJAX
  $(document).ready(function() {
    // Store initial state
    history.replaceState({ url: window.location.pathname }, '', window.location.pathname);

    // Attach click handlers to sidebar links
    $(document).on('click', '#sidebar a', handleLinkClick);

    // Attach click handlers to content links (prev/next navigation)
    $(document).on('click', '#body-inner a.highlight', function(e) {
      var href = $(this).attr('href');
      // Only handle internal navigation links
      if (href && href.charAt(0) === '/' || (href.indexOf(window.location.host) > -1)) {
        handleLinkClick.call(this, e);
      }
    });

    console.log('PJAX navigation initialized');
  });

})();
