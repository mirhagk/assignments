// loads the search box via google rendered code
// PARAMS:
//      id: search box div id to "draw"
//      lang: "E" or "F"

function loadSearchBox(id, lang, catalog, envPath) {
    if (lang == "F") {
        google.load('search', '1', { language: 'fr' });
    }
    else {
        google.load('search', '1', { language: 'en' });
    }
    // optional params
    if (!envPath) {
        var envPath = "";
    }
    if (!catalog) {
        var catalog = "";
    }
    google.setOnLoadCallback(function() {
        var customSearchOptions = {};
        var customSearchControl = new google.search.CustomSearchControl('012149276521530837882:f0j-62rvo6i', customSearchOptions); // english ID by default
        if (lang == "F") {
            customSearchControl = new google.search.CustomSearchControl('012149276521530837882:ux0ea6ekb5a', customSearchOptions);
        }
        customSearchControl.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
        var options = new google.search.DrawOptions();
        options.setAutoComplete(true);
        if (catalog != "") {
            catalog = "&ct=" + catalog;
        }
        var resultsRedirect = envPath + "/Search/Results.aspx?Language=" + lang + catalog;
        options.enableSearchboxOnly(resultsRedirect, "search_term");
        customSearchControl.draw(id, options);

        //Modify the title of the inputs.
        var searchBoxTitle, searchButtonTitle;
        var inputs = document.getElementsByTagName('input');

        if (lang == "E") {
            searchBoxTitle = 'Enter search terms';
            searchButtonTitle = 'Search';
        }
        else {
            searchBoxTitle = 'Indiquez les termes à chercher';
            searchButtonTitle = 'Rechercher';
        }

        for (var i = 0; i < inputs.length; i++) {
            if (Trim(inputs[i].className).toLowerCase() == 'gsc-input') {
                inputs[i].title = searchBoxTitle
            }
            else if (Trim(inputs[i].className).toLowerCase() == 'gsc-search-button') {
                inputs[i].title = searchButtonTitle
            }
        }
    }, true);
}

function Trim(stringToTrim) {
    return stringToTrim.replace(/^\s+|\s+$/g, "");
}