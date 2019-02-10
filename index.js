'use strict'

//https:www.googleapis.com/youtube/v3/search?q=query&part=snippet&masResults=3&key=ytkey
//responseJson.items.thumbnail.default or medium or high.url => thumbnail
//responseJson.items.id.videoId => https://www.youtube.com/embed/videoId
const ytkey = '';

const ytUrl = 'https://www.googleapis.com/youtube/v3/search';

//https://api.bestbuy.com/v1/products/sku.json?apiKey=bbkey
//responseJson.regularPrice => price
const bbkey = '';

const bbUrl = 'https://api.bestbuy.com/v1/products/';

function startBuild(event) {
  $('#js-start').submit(event => {
    event.preventDefault();
    $('.js-main-container').empty();
    $('.js-render').removeClass('hidden');
    populateOptions();
  });
}

function populateOptions() {
  populateCpu();
  populateMobo();
}

function populateCpu() {
  const cpuName = Object.keys(STORE.cpus);
  for (let i = 0; i < cpuName.length; i++) {
    let option = document.createElement('option');
    option.setAttribute('value', cpuName[i]);
    option.text = cpuName[i];
    let selectCpu = document.getElementById('js-cpu');
    selectCpu.appendChild(option);
  };
}

function populateMobo() {
  const moboName = Object.keys(STORE.mobos);
  for (let i = 0; i < moboName.length; i++) {
    let option = document.createElement('option');
    option.setAttribute('value', moboName[i]);
    option.text = moboName[i];
    let selectMobo = document.getElementById('js-mobo');
    selectMobo.appendChild(option);
  };
}

function onSelectCpu(selection) {
  let query = selection.value;
  getCpuYoutube(query);
  getCpuBestBuyPrice(STORE.cpus[query]);
}

function onSelectMobo(selection) {
  let query = selection.value;
  getMoboYoutube(query);
  getMoboBestBuyPrice(STORE.mobos[query]);
}

function getCpuYoutube(query) {
  const params = {
    key: ytkey,
    q: query + 'review',
    part: 'snippet',
    maxResults: 3
  };
  const queryString = formatQueryParams(params)
  const url = ytUrl + '?' + queryString;
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => renderCpuYoutube(responseJson))
    .catch(err => {
      $('#js-render-cpu').text(`Something went wrong: ${err.message}`);
    });
}

function getMoboYoutube(query) {
  const params = {
    key: ytkey,
    q: query + 'review',
    part: 'snippet',
    maxResults: 3
  };
  const queryString = formatQueryParams(params)
  const url = ytUrl + '?' + queryString;
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => renderMoboYoutube(responseJson))
    .catch(err => {
      $('#js-render-mobo').text(`Something went wrong: ${err.message}`);
    });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function renderCpuYoutube(responseJson) {
  // console.log(JSON.stringify((responseJson));
  $('#js-render-cpu').html(`<a class="myBtn" href="https://www.youtube.com/embed/${responseJson.items[0].id.videoId}">
  <img src="${responseJson.items[0].snippet.thumbnails['default'].url}"></a>
  <a class="myBtn" href="https://www.youtube.com/embed/${responseJson.items[1].id.videoId}">
  <img src="${responseJson.items[1].snippet.thumbnails['default'].url}"></a>
  <a class="myBtn" href="https://www.youtube.com/embed/${responseJson.items[2].id.videoId}">
  <img src="${responseJson.items[2].snippet.thumbnails['default'].url}"></a>`);
  renderModal();
}

function renderMoboYoutube(responseJson) {
  // console.log(JSON.stringify((responseJson));
  $('#js-render-mobo').html(`<a class="myBtn" href="https://www.youtube.com/embed/${responseJson.items[0].id.videoId}">
  <img src="${responseJson.items[0].snippet.thumbnails['default'].url}"></a>
  <a class="myBtn" href="https://www.youtube.com/embed/${responseJson.items[1].id.videoId}">
  <img src="${responseJson.items[1].snippet.thumbnails['default'].url}"></a>
  <a class="myBtn" href="https://www.youtube.com/embed/${responseJson.items[2].id.videoId}">
  <img src="${responseJson.items[2].snippet.thumbnails['default'].url}"></a>`);
  renderModal();
}

function renderModal() {
  $('.myBtn').on('click', function (event) {
    event.preventDefault();
    $('.modal').removeClass('hidden');
    const link = $(this).attr('href');
    $('.modal-content').html(`<span class="close">&times;</span><iframe width="100%" height="95%" src="${link}"></iframe>`);
    closeModal();
  });
}

function closeModal() {
  $('.close').on('click', function(event) {
    event.preventDefault();
    $('.modal').addClass('hidden');
  });
  // $(document).on('click', function(event) {
  //   if (!$(event.target).closest('.modal').length) {
  //     $('body').find('.modal').addClass('hidden');
  //   };
  // });
}

function getCpuBestBuyPrice(sku) {
  const apiKey = bbkey
  const url = bbUrl + sku + '.json' + '?apiKey=' + apiKey;
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => renderCpuBestBuyPrice(responseJson))
    .catch(err => {
      $('#js-render-cpu-price').text(`Something went wrong: ${err.message}`);
    });
}

function getMoboBestBuyPrice(sku) {
  const apiKey = bbkey
  const url = bbUrl + sku + '.json' + '?apiKey=' + apiKey;
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => renderMoboBestBuyPrice(responseJson))
    .catch(err => {
      $('#js-render-mobo-price').text(`Something went wrong: ${err.message}`);
    });
}

function renderCpuBestBuyPrice(responseJson) {
  $('#js-render-cpu-price').html(`<span>Price in USD: $${responseJson.regularPrice}</span>`);
}

function renderMoboBestBuyPrice(responseJson) {
  $('#js-render-mobo-price').html(`<span>Price in USD: $${responseJson.regularPrice}</span>`);
}

function onStart() {
  startBuild();
}

$(onStart);
