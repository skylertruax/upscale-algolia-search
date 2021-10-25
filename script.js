sendStartupEvents();

// required startup events to notify the consumer app of readiness and preferred iframe size
function sendStartupEvents() {
  let initEvent = { type: 'initialized' , data: null};
  this.sendMessage(initEvent); 
  
  let sizeEvent = { type: 'sizeChange', data: { height: 1200}} 
  this.sendMessage(sizeEvent);
}

function sendMessage(event , origin = "*") {
    // web
    if (window.parent !== window) {
        window.parent.postMessage(event, origin);
    }
    // android
    else if (((window).Android)) {
        ((window).Android).sendMessage(JSON.stringify(event));
    }
    // ios
    else if ((window).webkit && (window).webkit.messageHandlers && (window).webkit.messageHandlers.upscaleHandler) {
        (window).webkit.messageHandlers.upscaleHandler.postMessage(JSON.stringify(event));
    }
    else {
        console.log('no send method detected');
    }
}


//Algolia InstantSearch.js API
const searchClient = algoliasearch(
  'EIV4W95IVS',
  'c246677531e36c39898a2b57e3b045f5'
);

const search = instantsearch({
  indexName: 'dollar-store',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.configure({
    hitsPerPage: 10,
  }),

  instantsearch.widgets.searchBox({
    container: '#search-box',
    placeholder: 'Search for products',
    showReset: false,
  }),

  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: document.getElementById('hit-template').innerHTML,
      empty: 'We didnt find any results for the search criteria',
    },
  }),
  /*
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
*/
  instantsearch.widgets.refinementList(
    {
      container: '#facetsCategory',
      attribute: 'BRAND',
      sortBy: ['isRefined', 'count:desc', 'name:asc'],
      operator: 'or',
      templates: {
        item: `
          <a href="{{url}}" style="{{#isRefined}}font-weight: bold{{/isRefined}}">
            <span>{{label}} ({{count}})</span>
          </a>
        `,
      },
    }
  ),

  instantsearch.widgets.numericMenu({
    container: '#facetsPrice',
    attribute: 'unit',
    items: [
      { label: 'All' },
      { label: 'Case of 8', start: 8, end: 8 },
      { label: 'Case of 12', start: 12, end: 12 },
      { label: 'Case of 18', start: 18, end: 18 },
      { label: 'Case of 24', start: 24, end: 24 },
      { label: 'Case of 36', start: 36, end: 36 },
    ],
  })
]);

search.start();
