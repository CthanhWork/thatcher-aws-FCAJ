// Preserve menu expand/collapse state across page navigation
(function() {
  'use strict';

  // Storage key for menu state
  var STORAGE_KEY = 'sidebar-menu-state';

  // Save current menu state to localStorage
  function saveMenuState() {
    var state = {};
    $('#sidebar .dd-item.parent').each(function() {
      var navId = $(this).attr('data-nav-id');
      if (navId) {
        // Check if the submenu is visible (expanded)
        var isExpanded = $(this).children('ul').is(':visible');
        state[navId] = isExpanded;
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // Restore menu state from localStorage
  function restoreMenuState() {
    try {
      var stateJson = localStorage.getItem(STORAGE_KEY);
      if (!stateJson) return;

      var state = JSON.parse(stateJson);

      $('#sidebar .dd-item').each(function() {
        var $item = $(this);
        var navId = $item.attr('data-nav-id');

        if (navId && state.hasOwnProperty(navId)) {
          var $submenu = $item.children('ul');

          if (state[navId]) {
            // Should be expanded
            $item.addClass('parent');
            $submenu.show();
          } else {
            // Should be collapsed
            $item.removeClass('parent');
            $submenu.hide();
          }
        }
      });

      // Always expand parent items of active page
      var $activePage = $('#sidebar .dd-item.active');
      $activePage.parents('.dd-item').each(function() {
        $(this).addClass('parent');
        $(this).children('ul').show();
      });

    } catch (e) {
      console.error('Error restoring menu state:', e);
    }
  }

  // Initialize on document ready
  $(document).ready(function() {
    // Restore state first
    restoreMenuState();

    // Listen for clicks on menu items with children
    $('#sidebar').on('click', '.dd-item > a', function(e) {
      var $parentItem = $(this).parent('.dd-item');
      var $submenu = $parentItem.children('ul');

      // Only handle items that have submenus
      if ($submenu.length > 0) {
        // Don't prevent default if clicking to navigate
        // Let the navigation happen

        // Toggle parent class
        $parentItem.toggleClass('parent');

        // Save state after toggle
        setTimeout(saveMenuState, 100);
      }
    });

    // Save state when submenu is toggled via other means
    $('#sidebar').on('click', '.category-icon', function() {
      setTimeout(saveMenuState, 100);
    });

    // Also save state periodically in case of other interactions
    setInterval(saveMenuState, 2000);
  });

})();
