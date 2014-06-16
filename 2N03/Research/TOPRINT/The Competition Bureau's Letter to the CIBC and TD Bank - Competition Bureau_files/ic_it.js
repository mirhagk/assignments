(function ($) {
    "use strict";
    var icitbox = {
        toggle: function (e) {
            e.preventDefault();
            var $box = $($(this).attr('href'));

            if ($box.is(':hidden')) {
                $('.icitBox').filter(':visible').slideUp();
                $box.slideDown();
            } else {
                $box.slideUp();
            } 
        },
        addPrint: function () {
            var title,
                text;

            if ($('meta[name="dc.language"]').attr('content') === 'eng' || $('meta[name="dcterms.language"]').attr('content') === 'eng') {
                title = 'Print this page';
                text  = 'Print';
            } else {
                title = 'Imprimer cette page';
                text  = 'Imprimer';
            }

            $('#icitBar').children('ul').prepend('<li class="printButton"><a href="#" title="' + title + '" rel="alternate" onclick="javascript:window.print(); return false;">' + text + '</a></li>');
        },
        execute: function () {
            // Hide the containers, move them to #itb, add 'js' class
            $('.icitBox').hide()
                .addClass('jsIcItBox')
                .appendTo('#itb');

            // [icon link] Remove markup onclick, bind click event to toggle()
            $('#icitBar ul li a[onclick]').removeAttr('onclick');
                
            // [close link] Remove markup onclick, bind click event to toggle()
            $('.icitBox .icitBoxFooter a').removeAttr('onclick');

            icitbox.addPrint();

            // Fix bottom-of-page whitespace issue caused by hiding ITB boxes after WET's equalize() is called
            if ($('body').hasClass('eic-wet23')) {
                $('.equalize').children().css('min-height', '').parent().equalHeights(true);
            }
            
            // Use curvy-corners for WET v2.1
            if (!($('body').hasClass('eic-usability')) && !($('body').hasClass('eic-intranet')) && $.browser.msie) {
                $.getScript('/eic/home.nsf/js/_WET_2-1_curvycorners.js?Open', function () {
                    curvyCorners.init();
                });
            }
        }
    };

    // WET 3.1 removes onclick events on same-page anchors
    // the block below is executed in WET 3.0+ and puts our events back
    $(document).bind('wb-init-loaded', function () {
            // [icon link] Remove WET event, bind click event to toggle()
            $('#icitBar ul li a[href^="#"]').off()
                .bind('click', icitbox.toggle);

            // [close link] Remove WET event, bind click event to toggle()
            $('.icitBox .icitBoxFooter a').off()
                .bind('click', function (e) {
                    e.preventDefault();
                    $(this).closest('.icitBox').slideUp();
                });
    });

    $(document).ready(function () {
        icitbox.execute();

        // Events are bound here for WET < 3.0
        if (!($('body').hasClass('eic-wet31')) && !($('body').hasClass('eic-wet30'))) {
            $('#icitBar ul li a[href^="#"]').bind('click', icitbox.toggle);

            $('.icitBox .icitBoxFooter a').bind('click', function (e) {
                e.preventDefault();
                $(this).closest('.icitBox').slideUp(function () {
                    $(this).cs
                });
            });
        }

        // Move ITB at the bottom for v3.0, v3.1 and IC Subsites (v2.3+)
        if (($('body').hasClass('eic-wet31') || $('body').hasClass('eic-wet30')) || $('body').hasClass('eic-icsubsite')) {
            $('#icitBar, .icitBox').appendTo($('#wb-main, #cn-cols-inner'));
        }

        // Display toolbar
        $('#icitBar').show();

        // Call PIE (WET v2.3)
        if (typeof $.fn.wbpie === 'function') {
            $('.icitBox').wbpie();
        }
    });
}(jQuery));
