// Accordion behavior for Worklog week sections in the sidebar.
(function () {
  "use strict";

  var WEEK_SELECTOR = '#sidebar li.dd-item[data-nav-id^="/1-worklog/1-week"]';
  var WEEK_PATH_RE = /^\/1-worklog\/1-week\d+\/?$/;

  function isWeekItem($item) {
    var navId = $item.attr("data-nav-id") || "";
    return WEEK_PATH_RE.test(navId);
  }

  function getWeekItems() {
    return $(WEEK_SELECTOR).filter(function () {
      return isWeekItem($(this));
    });
  }

  function getItemIcon($item) {
    return $item.children("a").children(".week-collapse-icon");
  }

  function ensureWeekIcon($item) {
    var $submenu = $item.children("ul");

    if (!$submenu.length || getItemIcon($item).length) {
      return;
    }

    $item.children("a").prepend(
      '<i class="fas fa-angle-right week-collapse-icon" aria-hidden="true"></i>',
    );
  }

  function setWeekExpanded($item, expanded, animate) {
    var $submenu = $item.children("ul");
    var $icon = getItemIcon($item);

    if (!$submenu.length || !$icon.length) {
      return;
    }

    if (expanded) {
      $item.addClass("parent");
      $icon.removeClass("fa-angle-right").addClass("fa-angle-down");

      if (animate) {
        $submenu.stop(true, true).slideDown(180);
      } else {
        $submenu.show();
      }
    } else {
      $item.removeClass("parent");
      $icon.removeClass("fa-angle-down").addClass("fa-angle-right");

      if (animate) {
        $submenu.stop(true, true).slideUp(180);
      } else {
        $submenu.hide();
      }
    }
  }

  function getActiveWeekItem() {
    var $activePage = $("#sidebar .dd-item.active").first();
    var $activeWeek = $();

    if ($activePage.length) {
      if (isWeekItem($activePage)) {
        $activeWeek = $activePage;
      } else {
        $activeWeek = $activePage.parents("li.dd-item").filter(function () {
          return isWeekItem($(this));
        }).first();
      }
    }

    return $activeWeek;
  }

  function collapseAllWeeksExcept($keepItem, animate) {
    getWeekItems().each(function () {
      var $item = $(this);
      var shouldExpand = $keepItem.length && $keepItem[0] === $item[0];
      setWeekExpanded($item, shouldExpand, animate);
    });
  }

  function syncWorklogSidebarState() {
    var $weekItems = getWeekItems();

    if (!$weekItems.length) {
      return;
    }

    $weekItems.each(function () {
      ensureWeekIcon($(this));
    });

    var $activeWeek = getActiveWeekItem();

    if ($activeWeek.length) {
      collapseAllWeeksExcept($activeWeek, false);
    } else {
      collapseAllWeeksExcept($(), false);
    }
  }

  function toggleWeekItem($item) {
    var isExpanded = $item.children("ul").is(":visible");

    if (isExpanded) {
      setWeekExpanded($item, false, true);
      return;
    }

    collapseAllWeeksExcept($item, true);
  }

  $(document).ready(function () {
    syncWorklogSidebarState();

    $("#sidebar").on("click", ".week-collapse-icon", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var $item = $(this).closest("li.dd-item");

      if (isWeekItem($item)) {
        toggleWeekItem($item);
      }
    });

    $(document).on("pjax:content-updated", function () {
      syncWorklogSidebarState();
    });
  });
})();
