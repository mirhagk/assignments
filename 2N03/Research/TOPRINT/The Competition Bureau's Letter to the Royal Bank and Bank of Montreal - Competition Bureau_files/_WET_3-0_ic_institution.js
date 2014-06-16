/*global jQuery: false, ic: false*/
(function ($) {
    "use strict";
    var $html = $('html'),
        ie = false,
        ieFix,
        _ic = window.ic || {};

    if ($html.hasClass('ie7')) {
        ie = 7;
    } else if ($html.hasClass('ie8')) {
        ie = 8;
    }
    
    /* Utilities */
    _ic.vAlign = function (elms) {
        return elms.each(function () {
            var $this = $(this),
                ah = $this.height(),
                ph = $this.parent().outerHeight(false),
                mh = Math.ceil((ph - ah) / 2);

            $this.css('padding', mh + 'px 0');
        });
    };

    _ic.appendScript = function (url, callback) {
        var head = document.getElementsByTagName('head')[0],
            theScript = document.createElement('script');

        if (theScript.readyState) { // IE 
            theScript.onreadystatechange = function () {
                if (theScript.readyState === 'loaded' || theScript.readyState === 'complete') {
                    theScript.onreadystatechange = null;
                    callback();
                }
            };
        } else { // Others
            theScript.onload = callback;
        }

        theScript.src = url;
        head.appendChild(theScript);
    };

    // IE specific things
    ieFix = function () {
        /* Fading hr */
        if (ie) {
            $('hr').each(function () {
                if (!($(this).hasClass('thin'))) {
                    $(this).hide().after('<div class="ic-hr"></div>');
                }
            });
        }

        if (ie === 7) {
            _ic.vAlign($('.ic-button a')); /* EPI-7439 */

            /* EPI-7505 */
            $('.ic-arcBanner .content').each(function () {
                var $this = $(this),
                    imgWidth = $this.siblings('img').first().width(),
                    parentWidth = $this.parent().width(),
                    ah,
                    ph,
                    mh;
                // Width (needs to be before 'height')
                $this.width(parentWidth - imgWidth - parseInt($this.css('padding-left'), 10) - parseInt($this.css('padding-right'), 10));

                // Height (needs to be after 'width')
                ah = $this.height();
                ph = $this.parent().height();
                mh = Math.ceil((ph - ah) / 2);

                mh = mh + parseInt($this.css('padding-top'), 10);
                $this.css('padding-top', mh + 'px');
            });

            /* EPI-7498 */
            $('.ic-ss-tabs').each(function () {
                var $this = $(this),
                    ulWidth  = $this.find('.tabs').width(),
                    numTabs  = $this.find('.tabs li').length,
                    tabWidth = Math.round(ulWidth / numTabs);

                $this.find('.tabs li').each(function (i) {
                    if (i === 5) {
                        $(this).width(tabWidth - 2);
                    } else {
                        $(this).width(tabWidth);
                    }
                });
            });

            _ic.vAlign($('.ic-ss-tabs .tabs li a'));
        }
    };

    // Fix ie stuff
    if (ie) {
        ieFix();
    }

    /* Search button (megamenu) */
    $('.ic-mm-go').on('mouseenter', function () {
        $(this).attr('src', '/eic/home.nsf/images/ic_WET_2-3_searchicon-menu2.png/$file/ic_WET_2-3_searchicon-menu2.png');
    }).on('mouseleave', function () {
        $(this).attr('src', '/eic/home.nsf/images/ic_WET_2-3_searchicon-menu1.png/$file/ic_WET_2-3_searchicon-menu1.png');
    });

    /* Equal width tabs */
    $('.ic-ss-tabs .tabs li').each(function () {
        $(this).children('a').width($(this).width())
            .on('click', function () {
                $(this).closest('ul').children('li').removeClass('active');
                $(this).closest('li').addClass('active');
            });
        $('<span class="arrow"></span>').width($(this).width())
            .appendTo($(this));
    });

    /* Fix listbox keyboard nav in megamenu */
    $(document).on('wb-init-loaded', function () {
        var processed = [];

        if ($.fn.listbox) {
            $('#types, #refs').listbox();
        }

        $('.wet-boew-menubar').find('.listbox').each(function () {
            var $this = $(this),
                $childmenu = $this.closest('.mb-sm'),
                index = $childmenu.prev().children('a').get(0).className, // NOTE: we're relying specific megamenu markup -- get(0) could be null
                regex = /knav-(\d+)/;

            index = regex.exec(index)[1]; // NOTE: we're relying specific megamenu markup -- regex could return null

            // Don't re-map knav more than once per submenu
            if (processed[index] !== true) {
                processed[index] = true;
                
                $childmenu.find('[class*="knav-"]').removeClass(function () {
                        return /(knav-\d+-\d+-\d+)/.exec(this.className)[1];
                });

                $childmenu.find('.listbox [role="button"], .ic-mm-go, h3 a, h4 a, div.top-level > a, li.top-level a, div.mb-main-link > a').each(function (i) {
                    var $this = $(this),
                        $parent = $this.parent();
                    this.className += ' knav-' + index + '-' + (i + 1) + '-0';
                    if ($parent.is('h3, h4')) {
                        $this.parent().next('ul').find('a').each(function (j) {
                            this.className += ' knav-' + index + '-' + (i + 1) + '-' + (j + 1);
                        });
                    } else if ($this.is('[role="button"]')) {
                        $parent.find('[role="option"]').each(function (j) {
                            this.className += ' knav-' + index + '-' + (i + 1) + '-' + (j + 1);
                        });
                    }
                    return;
                });
                $childmenu.find('> ul li, > div > ul li').filter(':not(.top-level)').children('a').each(function (i) {
                    this.className += ' knav-' + index + '-0-' + (i + 1);
                });
            }
        });
    });

    window.ic = _ic;
}(jQuery));
