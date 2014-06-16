/*global endTime: false, startTime: false, WebTrends: false, jQuery: false*/
(function ($) {
    // Can't use strict because of webtrends.js lib
    // 'use strict';
    var loadTime = (endTime - startTime) / 1000,
        $metrics = $('#metrics');

    window._tag = new WebTrends();
    window._tag.dcsGetId();

    // EPI-9814 - Collect more info if we're on a corpcan page
    if (window.location.pathname.match(/^\/app\/scr\/cc\/CorporationsCanada\//) !== null) {
        window._tag.dcsCustom = function () {
            window._tag.DCSext.loadTime = loadTime;

            // corpcan metrics
            window._tag.DCSext.metricView = $metrics.data('metric-view');
            window._tag.DCSext.metricAct = $metrics.data('metric-act');
            window._tag.DCSext.metricRequestType = $metrics.data('metric-request-type');
            window._tag.DCSext.metricConversationId = $metrics.data('metric-conversation-id');
            window._tag.WT.seg_1 = $metrics.data('metric-user-type');
            window._tag.DCSext.metricNameMethod = $metrics.data('metric-name-method');
            window._tag.DCSext.metricUrl = '/vpv/' + $metrics.data('metric-request-type') + '/' + $metrics.data('metric-view') + '/act-' + $metrics.data('metric-act');
        };
    } else {
        window._tag.dcsCustom = function () {
            window._tag.DCSext.loadTime = loadTime;
        };
    }

    /* EPI-9242 */
    (function fixRace() {
        // hijack createimage so we can trigger an event once the image is loaded
        // in reality we only need to wait until the server got the request
        window._tag.dcsCreateImage = function (dcsSrc) {
            $('<img src="' + dcsSrc + '" alt="" style="display: none;" />')
                .imagesLoaded(function () {
                    $('a[onclick^="dcsMultiTrack"]').trigger('ic.wt-image-loaded');
                    /* Test for forms */ $(document).trigger('ic.wt-image-loaded');
                })
                .appendTo('body');
        };

        // Cache original dcsMultiTrack and replace it with nothing
        // This ensures WT doesn't fire anything before our click handler is executed
        window.oDcsMultiTrack = window.dcsMultiTrack;
        window.dcsMultiTrack = function () {};

        // Tracked link is clicked
        // EPI-10035: Can't use .on() until CIPO upgrades from v2.1
        // $('a[onclick^="dcsMultiTrack"]').on('click', function (e) {
        $('a[onclick^="dcsMultiTrack"]').bind('click', function (e) {
            e.preventDefault(); // Don't follow link yet

            var $this = $(this);

            // Once the WT image has been loaded, follow link
            $this.one('ic.wt-image-loaded', function () {
                if (!$this.hasClass('wt-js')) {
                    window.location = $this.attr('href');
                }
                window.dcsMultiTrack = function () {};
            });

            // Put back the original dcsMultiTrack and call it
            window.dcsMultiTrack = window.oDcsMultiTrack;
            $this.get(0).onclick.call();
        });
    }());

    window._tag.dcsCollect();
}(jQuery));
