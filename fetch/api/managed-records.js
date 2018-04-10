import fetch from '../util/fetch-fill';
import URI from 'urijs';

// /records endpoint
window.path = 'http://localhost:3000/records';

// returns true if a color is considered primary (red, blue, or yellow")
var isPrimary = function(color) {
  return color === 'red' || color === 'blue' || color === 'yellow';
};

// returns true is a record's disposition is open
var isOpen = function(status) {
  return status === 'open';
};

// gets the count of the number of records given a url query
var getRecordCountInNextPage = function(url) {
  return fetch(url)
    .then(response => {
      if (response.status !== 200) {
        console.log(
          'Looks like there was a problem. Status Code: ' + response.status
        );
        return;
      }
      return response.json();
    })
    .then(json => {
      var numRecords = json.length;
      return numRecords;
    })
    .catch(error => {
      console.log('Fetch Error : ', error);
    });
};

// outputs a url in the format: /records?limit=2&offset=0&color[]=brown&color[]=green
var makeUrl = function(page, colors) {
  var limit = 10;
  var offset = '&offset=' + (page - 1) * limit;
  var colors = colors ? '&color[]=' + colors.join('&color[]=') : '';
  var url = new URI(window.path + '?limit=' + limit + offset + colors);
  return url;
};

// retrieves the records with page and color criteria fron input object, and transforms the result
var retrieve = async function(obj) {
  if (obj === undefined) {
    obj = {};
  }
  var limit = 10;

  var page = obj.page ? obj.page : 1;

  var colors = obj.colors;

  // create query url based on input (obj)
  var url = makeUrl(page, colors);

  //get the number of records in the next page for the same query as current page
  var numRecordsInNextPage = await getRecordCountInNextPage(
    makeUrl(page + 1, colors)
  );

  return fetch(url)
    .then(response => {
      if (response.status !== 200) {
        console.log(
          'Looks like there was a problem. Status Code: ' + response.status
        );
        return;
      }

      return response.json();
    })
    .then(result => {
      var prevPage = page === 1 ? null : page - 1;
      var nextPage = numRecordsInNextPage === 0 ? null : page + 1;

      //construct payload object
      var payload =
        result.length === 0
          ? {
              previousPage: prevPage,
              nextPage: nextPage,
              ids: [],
              open: [],
              closedPrimaryCount: 0
            }
          : {
              previousPage: prevPage,
              nextPage: nextPage,
              ids: result.map(info => info.id),
              open: result.filter(info => isOpen(info.disposition)),
              closedPrimaryCount: result.filter(
                info => !isOpen(info.disposition) && isPrimary(info.color)
              ).length
            };

      return payload;
    })
    .then(payload => {
      //add isPrimary field on open object in payload
      payload.open.forEach(info => {
        info.isPrimary = isPrimary(info.color);
      });

      return payload;
    })
    .catch(error => {
      console.log('Fetch Error : ', error);
    });
};

export default retrieve;
