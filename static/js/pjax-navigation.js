// PJAX navigation for smooth page transitions
(function () {
  "use strict";

  // Check if browser supports History API
  if (!window.history || !window.history.pushState) {
    console.log("PJAX: Browser does not support History API");
    return;
  }

  var isNavigating = false;

  function fetchPage(url) {
    return fetch(url, {
      headers: {
        "X-PJAX": "true",
      },
      cache: "no-store",
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    });
  }

  function rebindSidebarCategoryIcons() {
    $("#sidebar .category-icon")
      .off("click")
      .on("click", function () {
        $(this).toggleClass("fa-angle-down fa-angle-right");
        $(this).parent().parent().children("ul").toggle();
        return false;
      });
  }

  function updateSidebarMenu(doc) {
    var newTopics = doc.querySelector("#sidebar .highlightable > ul.topics");
    var currentTopics = document.querySelector("#sidebar .highlightable > ul.topics");

    if (!newTopics || !currentTopics) {
      return;
    }

    currentTopics.innerHTML = newTopics.innerHTML;
    rebindSidebarCategoryIcons();

    if (window.$ && $.fn && $.fn.perfectScrollbar) {
      $("#sidebar .highlightable").perfectScrollbar("update");
    }
  }

  function updateActiveMenuItem(url) {
    $("#sidebar .dd-item").removeClass("active");

    var $menuItem = $('#sidebar [data-nav-id="' + url + '"]');
    $menuItem.addClass("active");

    $menuItem.parents(".dd-item").each(function () {
      $(this).addClass("parent");
      $(this).children("ul").show();
    });
  }

  function restoreVisitedLinks() {
    for (var i = 0; i < sessionStorage.length; i++) {
      var key = sessionStorage.key(i);
      if (sessionStorage.getItem(key) === "1") {
        $('[data-nav-id="' + key + '"]').addClass("visited");
      }
    }
  }

  function reinitializeFeatures() {
    if (window.hljs) {
      document.querySelectorAll("pre code").forEach(function (block) {
        hljs.highlightBlock(block);
      });
    }

    if (window.ClipboardJS) {
      $("code").each(function () {
        var code = $(this);
        var text = code.text();
        if (text.length > 5 && !code.next(".copy-to-clipboard").length) {
          code.after('<span class="copy-to-clipboard" title="Copy to clipboard" />');
        }
      });
    }

    $('#body-inner a:not(:has(img)):not(.btn):not(a[rel="footnote"])').addClass("highlight");

    if (window.featherlight) {
      $('a[rel="lightbox"]').featherlight({
        root: "section#body",
      });
    }

    $("body").attr("data-url", window.location.pathname);
  }

  function updateContent(html, url) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");

    var newContent = doc.querySelector("#body-inner");
    var oldContent = document.querySelector("#body-inner");

    if (newContent && oldContent) {
      oldContent.style.opacity = "0";
      oldContent.style.transition = "opacity 0.2s ease";

      setTimeout(function () {
        oldContent.innerHTML = newContent.innerHTML;

        updateSidebarMenu(doc);

        var newTitle = doc.querySelector("title");
        if (newTitle) {
          document.title = newTitle.textContent;
        }

        updateActiveMenuItem(url);

        window.scrollTo(0, 0);

        oldContent.style.opacity = "1";

        reinitializeFeatures();
        restoreVisitedLinks();

        $(document).trigger("pjax:content-updated", [url]);

        sessionStorage.setItem($("body").data("url"), 1);
        $('[data-nav-id="' + url + '"]').addClass("visited");
      }, 200);
    }
  }

  function handleLinkClick(e) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) {
      return;
    }

    var $link = $(e.currentTarget);
    var href = $link.attr("href");

    if (!href || href.charAt(0) === "#") {
      return;
    }

    if (href.indexOf("://") > -1 && href.indexOf(window.location.host) === -1) {
      return;
    }

    if (isNavigating) {
      return;
    }

    var url = href;
    if (url.charAt(0) !== "/") {
      var a = document.createElement("a");
      a.href = url;
      url = a.pathname;
    }

    e.preventDefault();
    isNavigating = true;

    $("body").addClass("pjax-loading");

    fetchPage(url)
      .then(function (html) {
        updateContent(html, url);
        history.pushState({ url: url }, "", url);
        isNavigating = false;
        $("body").removeClass("pjax-loading");
      })
      .catch(function (error) {
        console.error("PJAX navigation failed:", error);
        window.location.href = url;
        isNavigating = false;
        $("body").removeClass("pjax-loading");
      });
  }

  window.addEventListener("popstate", function (e) {
    if (e.state && e.state.url) {
      var url = e.state.url;

      $("body").addClass("pjax-loading");

      fetchPage(url)
        .then(function (html) {
          updateContent(html, url);
          $("body").removeClass("pjax-loading");
        })
        .catch(function (error) {
          console.error("PJAX popstate failed:", error);
          window.location.href = url;
          $("body").removeClass("pjax-loading");
        });
    }
  });

  $(document).ready(function () {
    history.replaceState({ url: window.location.pathname }, "", window.location.pathname);

    $(document).on("click", "#sidebar a", handleLinkClick);

    $(document).on("click", "#body-inner a.highlight", function (e) {
      var href = $(this).attr("href");
      if (href && (href.charAt(0) === "/" || href.indexOf(window.location.host) > -1)) {
        handleLinkClick.call(this, e);
      }
    });

    console.log("PJAX navigation initialized");
  });
})();
