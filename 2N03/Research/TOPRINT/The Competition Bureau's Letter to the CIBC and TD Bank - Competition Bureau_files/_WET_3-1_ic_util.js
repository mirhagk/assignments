/*global jQuery: false, pe: false, SurveyPrompt: false, PIE: false*/

(function ($) {
    'use strict';

    window.eic = {
        fluidSurvey: function (id, href) {
            pe.add._load('https://ic.sondages-surveys.ca/media/static/survey-prompts.js', 'ic.fs-loaded');
            $(document).on('ic.fs-loaded', function () {
                window.FSPROMPT = new SurveyPrompt({
                    id: id,
                    href: href,
                    "$": jQuery
                }).setup();

                jQuery.noConflict(true);
            });
        },

        pie: function ($this) {
            var pieEnabled = false,
                $cols = $('#cn-cols'),
                $colsInner = $cols.children('#cn-cols-inner');

            if (window.PIE) {
                $this.filter(function () {
                    return $(this).css('position') === 'static';
                }).css('position', 'relative');

                if (pe.ie === '7.0') { // IE 7
                    var body = document.body,
                        r = body.getBoundingClientRect();

                    if ((r.left - r.right) / body.offsetWidth === -1) {
                        pieEnabled = setupPIE();
                    } else {
                        $cols.css('margin-bottom', ($colsInner.offset().top + $colsInner.height()) - ($cols.offset().top + $cols.height()));
                    }
                } else if (pe.ie === '8.0') { // IE 8 
                    pieEnabled = setupPIE();
                } else {
                    pieEnabled = setupPIE();
                }
            }

            function setupPIE() {
                $this.each(function () {
                    PIE.attach(this);
                });

                return true;
            }
        },

        cookie: function (name, value, days) {
            var getCookie,
                setCookie,
                ret;

            getCookie = function (name) {
                var cookies = document.cookie.split(';'),
                    len = cookies.length,
                    i,
                    outage,
                    cpair;

                for (i = 0; i < len; i += 1) {
                    cpair = cookies[i].split('=');

                    if ($.trim(cpair[0]) === name) {
                        outage = cpair[1];
                        break;
                    }
                }

                return outage;
            };

            setCookie = function (name, value, days) {
                var date = new Date(),
                    expires = '';

                if (days !== undefined) {
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = '; expires=' + date.toGMTString();
                }

                document.cookie = name + "=" + value + expires + '; path=/';
            };

            if (value === undefined) {
                ret = getCookie(name);
            } else {
                ret = setCookie(name, value, days);
            }

            return ret;
        }
    };

    // TODO: Find a place to run these
    /* Cookie for IC Outage Notice */
    (function () {
        // TODO: Add cookie for each dismissible
        //       Have cookie name in data-* attr
        if ($('.ic_warning.ic-dismissible').length > 0) {
            if (window.eic.cookie('outage') !== 'dismissed') {
                $('<button type="button" title="close" class="ic-close"></button>')
                    .appendTo($('.ic_warning'))
                    .on('click', function () {
                        // Next wednesday
                        var expires = 6 - 3 - new Date().getDay();

                        if (expires <= 0) {
                            expires = expires + 7;
                        }

                        window.eic.cookie('outage', 'dismissed', expires);
                        $(this).closest('div.ic_warning').slideUp(function () {
                            $('.warn_wrapper').css('display', 'none');
                        });
                    });

                $('.ic_warning').css('display', 'block');
            } else {
                $('.warn_wrapper').css('display', 'none');
            }
        }
    }());

    $(document).trigger('eic.loaded');

    /**
     * EPI-9917 - Add link to GoC search on FedDev Ontario search results page 
     *           - Temporary. This should probably be done by the apps team...
     */
    $(document).on('wb-init-loaded', function () {
        // Only do the following on the search results page of feddev ontario
        if (pe.urlpage.host === 'www.feddevontario.gc.ca' && pe.urlpage.path === '/app/cmmn/srch/vSearch') {
            var txt = (pe.language === 'en') ? 'Didn\'t find what you\'re looking for?' : 'Vous n\'avez pas trouvé ce que vous cherchiez?',
                linkTxt = (pe.language === 'en') ? 'Search all Government of Canada websites' : 'Effectuez une recherche dans tous les sites Web du gouvernement du Canada',
                lang = (pe.language === 'en') ? 'eng' : 'fra',
                q = pe.urlquery["V_FULLTEXT.value"],
                $productCode = $('[name="V_SEARCH.productCode"]');

            // Fix product code markup
            if ($productCode.val() === '!DEFVAR3s!') {
                $productCode.val('723');
            }

            // If we have a search query, add GoC search link near the top of the page
            if (q) {
                $('#resultsReturned').after('<p style="margin: 10px 0 0 0;">' + txt + ' <a href="http://recherche-search.gc.ca/rGs/s_r?st=s&s5bm3ts21rch=x&num=10&st1rt=0&langs=' + lang + '&cdn=canada&q=' + q + '">' + linkTxt + '</a></p>');
            }
        }
    });
}(jQuery));
