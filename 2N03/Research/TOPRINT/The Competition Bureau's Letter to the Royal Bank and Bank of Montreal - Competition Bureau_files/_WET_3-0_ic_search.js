/*global facets: true, types: true, jQuery: false, google: false, ic_results: false*/
(function ($) {
    "use strict";
    var firstSearch = true,
        clearBox = false,
        lang = ($('html').attr('lang') === 'en') ? 'en' : 'fr',
        dict = {
            byRelevance: (lang === 'en') ? 'Sort by relevance' : 'Trier par pertinance',
            prevPage: (lang === 'en') ? 'Previous<span class="wb-invisible"> page</span>' : '<span class="wb-invisible">Page </span>pr&eacute;c&eacute;dente',
            nextPage: (lang === 'en') ? 'Next<span class="wb-invisible"> page</span>' : '<span class="wb-invisible">Page </span>suivante'
        },
        buildUrl,
        parseUrl,
        afterSearch,
        init,
        customSearchControl,
        gcse = document.createElement('script'),
        s = document.getElementsByTagName('script')[0],
        cx  = $('[name="cx"]').first().val();

    // Check if we have faceted search
    // note: facets, types are global vars that may be defined in the site footer
    if (typeof facets === 'undefined') {
        var facets = '';
    }
    if (typeof types === 'undefined') {
        var types = '';
    }

    // Scan left-nav
    // Build URL depending on what has 'class selected'
    buildUrl = function (e) {
        var search = '?Open',
            refs = '',
            type = '',
            q = document.getElementById('find').value,
            page = (e.data && e.data.page) ? e.data.page : null;

        $('#ic-sort').next().find('a.selected').each(function () {
            if (this.id === 'byDate') {
                search += '&sort=date';
            }
        });

        $('#ic-topic').next().find('input:checked').each(function () {
            var theID = this.id;
            theID = theID.substr(theID.indexOf('-') + 1);
            refs += facets[theID].urlParm + '+';
        });

        $('#ic-type').next().find('input:checked').each(function () {
            var theID = this.id;
            theID = theID.substr(theID.indexOf('-') + 1);
            type += types[theID].urlParm + '+';
        });

        if (q) {
            search += '&q=' + q; // TODO: url encode
        }

        if (refs) {
            search += '&refinement=' + refs.substr(0, refs.length - 1);
        }

        if (type) {
            search += '&type=' + type.substr(0, type.length - 1);
        }

        if (page) {
            search += '&page=' + page;
        }

        search += '&ieutf=\uFFA0';

        // Trigger search
        window.location.search = search;
    };

    parseUrl = function () {
        var search = window.location.search.substr(1),
            parts = search.split('&'),
            queryAdditions = '',
            extendedArgs = '',
            q = '',
            page = '',
            i = 0,
            j = 0,
            k = 0,
            len,
            leng,
            lengt,
            keyvaluepair,
            key,
            value,
            refs,
            lbl_facet,
            type,
            lbl_type,
            txt;

        for (i = 0, len = parts.length; i < len; i += 1) {
            keyvaluepair = parts[i].split('=');
            key = decodeURIComponent(keyvaluepair[0]);
            value = decodeURIComponent(keyvaluepair[1]);

            switch (key) {
            case 'sort':
                if (value === 'date') {
                    extendedArgs = {'sort': 'date'};
                    $('#byRelevance').removeClass('selected');
                    $('#byDate').addClass('selected')
                        .text(dict.byRelevance);
                }
                break;
            case 'refinement':
                refs = value.split('+');

                for (j = 0, leng = refs.length; j < leng; j += 1) {
                    for (k = 0, lengt = facets.length; k < leng; k += 1) {
                        if (refs[j] === facets[k].urlParm) {
                            queryAdditions += facets[k].data + ' '; // TODO: Sync left-nav
                            facets[k].selected = true; // FIXME: Temporary
                            lbl_facet = facets[k].label;
                        }
                    }
                }
                break;
            case 'type':
                type = value.split('+');

                for (j = 0, leng = type.length; j < leng; j += 1) {
                    for (k = 0, lengt = types.length; k < lengt; k += 1) {
                        if (type[j] === types[k].urlParm) {
                            queryAdditions += types[k].data + ' OR '; // TODO: Sync left-nav
                            types[k].selected = true; // FIXME: Temporary
                            lbl_type = types[k].label;
                        }
                    }
                }

                queryAdditions = queryAdditions.replace(/ OR $/, ' '); // Remove trailing ' OR ' if there is one
                break;
            case 'q':
                if (value !== undefined) {
                    q = value.replace(/\+/g, ' ');
                }
                break;
            case 'page':
                if (value !== undefined) {
                    page = value;
                }
                break;
            }
        }

        /* Only on predefined search page */
        if ($('.ic-predef').length) {
            if (typeof lbl_facet === 'undefined') {
                lbl_facet = '';
            }
            if (typeof lbl_type === 'undefined') {
                lbl_type = '';
            }

            if (lbl_type !== '' && lbl_facet !== '') {
                lbl_type =  '\u2014' + lbl_type;
            }

            if (lbl_facet !== '' || lbl_type !== '') {
                $('#find_lbl').text('Search within ' + lbl_facet + lbl_type);
            }

            $('.subbanner').text(lbl_facet + lbl_type);
            document.title = lbl_facet + lbl_type;

            document.getElementById('search').onsubmit = function () {
                buildUrl();
                return false;
            };
        }

        if (q === '') {
            q = queryAdditions;
            queryAdditions = '';
            clearBox = true;
        } else {
            document.getElementById('find').value = q;
        }

        customSearchControl.setSearchStartingCallback(
            this,
            function (control, searcher, query) {
                searcher.setRestriction(google.search.Search.RESTRICT_EXTENDED_ARGS, extendedArgs);
                searcher.setQueryAddition(queryAdditions);
            }
        );

        txt = (lang === 'en') ? 'Enter a keyword' : 'Entrez un mot clé';

        if (q === '') {
            $('#loading').css('background', 'none')
                .text(txt);
        }

        $('#loading').show();

        if (page === '') {
            customSearchControl.execute(q);
        } else {
            customSearchControl.execute(q, page);
        }
    };

    afterSearch = function (customSearchControl, searcher) {
        var bestMatch = (lang === 'en') ? 'Best match for your search' : 'Le meilleur r&eacute;sultat pour votre recherche',
            $leftNav = $('.ic-left-nav'),
            i,
            len,
            currPage,
            lastPage,
            searchBox = document.getElementById('find');

        $('#loading').hide();

        // Remove filters from search query in spelling corrections
        $('.gs-spelling').each(function () {
            var $this = $(this),
                term = $this.find('b').remove();
            $this.find('a').empty();
            $this.find('a').append(term);
        });

        $('.gsc-promotion').filter(':first').append('<span id="bestMatch">' + bestMatch + '</span>')
            .css({'position': 'relative', 'border-top': '1px solid #DEF'});

        $('.gsc-promotion').filter(':last').css({'border-bottom': '1px solid #DEF', 'margin-bottom': '10px'});

        if (clearBox) {
            searchBox.value = '';
        }

        $(searchBox).show();
        if (firstSearch) {
            $('h3 a', $leftNav).click(function (e) {
                var $this = $(this);
                e.preventDefault();
                e.stopPropagation();

                $this.parent().next().slideToggle(); // FIXME: parent().next() is strongly dependant on markup
                $this.parent().toggleClass('expanded collapsed'); // FIXME: parent().next() is strongly dependant on markup
            });

            // TODO: Merge this with "#byRelevance" and branch inside single function.
            $('#byDate').click(function (e) {
                var $this = $(this);
                e.preventDefault();
                e.stopPropagation();

                if ($this.text() === dict.byRelevance) {
                    $('#byRelevance').trigger('click');
                } else {
                    $('#ic-sort').next().find('a').removeClass('selected');
                    $this.addClass('selected');
                    buildUrl();
                }
            })
                .prependTo('#cse');

            $('#byRelevance').click(function (e) {
                e.preventDefault();
                e.stopPropagation();

                $('#ic-sort').next().find('a').removeClass('selected');
                $(this).addClass('selected');

                buildUrl();
            });

            // TODO: Merge this with "#ic-forms" and branch inside single function.
            $('#ic-topic').after(function () {
                var $refinements = $('<ul></ul>'),
                    i,
                    len;

                for (i = 0, len = facets.length; i < len; i += 1) {
                    $('<input type="checkbox" class="' + facets[i].urlParm + '"/>').click(buildUrl)
                        .attr('id', 'filter-' + i.toString()) // FIXME: Duplicate IDs. Find another way to store this (or figure out closures)
                        .appendTo($refinements)
                        .wrap('<li></li>')
                        .after('<label for="filter-' + i.toString() + '">' + facets[i].label + '</label>');
                }
                return $refinements;
            });

            $('#ic-type').after(function () {
                var $refinements = $('<ul></ul>'),
                    i,
                    len;
                for (i = 0, len = types.length; i < len; i += 1) {
                    $('<input type="checkbox" class="' + types[i].urlParm + '"/>').click(buildUrl)
                        .attr('id', 'types-' + i.toString())  // FIXME: Duplicate IDs.  Find another way to store this (or figure out closures)
                        .appendTo($refinements)
                        .wrap('<li></li>')
                        .after('<label for="types-' + i.toString() + '">' + types[i].label + '</label>');
                }
                return $refinements;
            });

            $('.ic-left-nav').show();
            firstSearch = false;
        }

        // Sync left nav with current search (temporary solution)
        for (i = 0, len = facets.length; i < len; i += 1) {
            if (facets[i].selected) {
                $('#ic-topic li:nth-child(' + parseInt(i + 1, 10) + ') input').prop('checked', true); // FIXME: Strongly dependant on HTML structure
            }
        }

        for (i = 0, len = types.length; i < len; i += 1) {
            if (types[i].selected) {
                $('#ic-type li:nth-child(' + parseInt(i + 1, 10) + ') input').prop('checked', true); // FIXME: Strongly dependant on HTML structure
            }
        }

        $('.gsc-cursor-page').each(function () {
            var $this = $(this);

            $this.on('click', {page: $this.text()}, buildUrl);
        });

        currPage = parseInt($('.gsc-cursor-current-page').text(), 10);
        lastPage = parseInt($('.gsc-cursor-page').last().text(), 10);

        if (currPage > 1) {
            $('<div class="gsc-cursor-page ic-prev-page" tabindex="0">' + dict.prevPage + '</div>')
                .prependTo('#cse .gsc-cursor')
                .on('click', {page: currPage - 1}, buildUrl);
        }
        if (currPage < lastPage) {
            $('<div class="gsc-cursor-page ic-next-page" tabindex="0">' + dict.nextPage + '</div>')
                .appendTo('#cse .gsc-cursor')
                .on('click', {page: currPage + 1}, buildUrl);
        }
    };

    init = function () {
        var drawOptions,
            options = {},
            cse = document.getElementById('cse');

        // Attach auto-completion
        $('.g-sugg').each(function () {
            var frm = $(this).closest('form').attr('action', ic_results);
            frm.find('[name="cx"], [name="nojs"]').remove();

            google.search.CustomSearchControl.attachAutoCompletionWithOptions(
                cx,
                this.id,
                frm.get(0)
            );
        });

        // We're on a search results page
        if (cse) {
            options[google.search.Search.RESTRICT_EXTENDED_ARGS] = {'lr': 'lang_' + $('html').attr('lang')};

            customSearchControl = new google.search.CustomSearchControl(cx, options);
            customSearchControl.setLinkTarget(google.search.Search.LINK_TARGET_SELF);
            customSearchControl.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
            customSearchControl.setSearchCompleteCallback(this, afterSearch, null);

            drawOptions = new google.search.DrawOptions();
            drawOptions.enableSearchResultsOnly();
            customSearchControl.draw('cse', drawOptions);

            parseUrl();
        }
    };

    window.__gcse = {
        parsetags: 'explicit',
        plainStyle: true,
        callback: init
    };

    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') + '//www.google.com/cse/cse.js?cx=' + cx;
    s.parentNode.insertBefore(gcse, s);
}(jQuery));
