'use strict'

function startBuild(event) {
  $('#js-start').submit(event => {
    event.preventDefault();
    $('.js-main-container').addClass('hidden');
    $('.js-render').removeClass('hidden');
    onIntelSelection();
    onAmdSelection();
    populateOptions();
    listenSelection();
  });
}

function goHome() {
  $('.js-header').on('click', function(event) {
    event.preventDefault();
    location.reload();
  });
}

function listenSelection() {
  Object.keys(STORE).forEach(type => {
    onChange(type);
  });
}

function onChange(type) {
  const name = Object.keys(STORE[type]);
  for (let i = 0; i < name.length; i++);
  $(`#js-${type}`).change(function() {
    const select = document.getElementById(`js-${type}`);
    const query = select.options[select.selectedIndex].text;
    const sku = STORE[type][query];
    onSelection(query, sku, type);
  });
}

function populateOptions() {
  Object.keys(STORE).forEach(type => {
    populateItem(type);
  });
  onDefaultCpu();
}

function populateItem(type) {
  const name = Object.keys(STORE[type]);
  for (let i = 0; i < name.length; i++) {
    const option = document.createElement('option');
    option.setAttribute('value', name[i]);
    option.text = name[i];
    const select = document.getElementById(`js-${type}`);
    select.appendChild(option);
  };
}

function onDefaultCpu() {
  const type = 'intel';
  onCpuSelection(type);
}

function onIntelSelection() {
  $('#intel').on('click', function() {
    const type = 'intel';
    onCpuSelection(type);
  });
}

function onAmdSelection() {
  $('#amd').on('click', function() {
    const type = 'amd';
    onCpuSelection(type);
  });
}

function onCpuSelection(type) {
  const val = type === 'intel' ? true : false;
  $("#js-mobo option[value = 'ASUS-ROG STRIX B450-F GAMING']").prop('disabled', val);
  $("#js-mobo option[value = 'ASUS-TUF X470-PLUS GAMING']").prop('disabled', val);
  $("#js-mobo option[value = 'ASUS-ROG CROSSHAIR VII HERO']").prop('disabled', val);
  $("#js-mobo option[value = 'ASUS-ROG STRIX H370-F GAMING']").prop('disabled', !val);
  $("#js-mobo option[value = 'ASUS-TUF Z390-PLUS GAMING']").prop('disabled', !val);
  $("#js-mobo option[value = 'ASUS-ROG MAXIMUS XI HERO']").prop('disabled', !val);
  $("#js-cpu option[value = 'Intel i3-8100']").prop('disabled', !val);
  $("#js-cpu option[value = 'Intel i5-8400']").prop('disabled', !val);
  $("#js-cpu option[value = 'Intel i7-8700']").prop('disabled', !val);
  $("#js-cpu option[value = 'AMD Ryzen 5 2600']").prop('disabled', val);
  $("#js-cpu option[value = 'AMD Ryzen 7 2700']").prop('disabled', val);
  resetCpuMobo();
}

function resetCpuMobo() {
  $('#js-cpu')[0].selectedIndex = 0;
  $('#js-mobo')[0].selectedIndex = 0;
  emptyRender();
}

function emptyRender() {
  $('#js-render-cpu').empty();
  $('#js-render-mobo').empty();
  $('#js-render-cpu-price').empty();
  $('#js-render-mobo-price').empty();
}

function onSelection(query, sku, type) {
  if (sku === "off") {
    isEmpty(type);
  } else {
    getYoutube(query, type);
    getBestBuyPrice(sku, type);
  };
}

function isEmpty(type) {
  $(`#js-render-${type}`).empty();
  $(`#js-render-${type}-price`).empty();
}

function getYoutube(query, type) {
  const params = {
    key: ytkey,
    q: query,
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
    .then(responseJson => renderYoutube(responseJson, type))
    .catch(err => {
      $(`#js-render-${type}`).text(`Something went wrong: ${err.message}`);
    });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function renderYoutube(responseJson, type) {
  $(`#js-render-${type}`).html(`<a class="myBtn" href="https://www.youtube.com/embed/${responseJson.items[0].id.videoId}">
  <img src="${responseJson.items[0].snippet.thumbnails['default'].url}"></a>
  <a class="myBtn" href="https://www.youtube.com/embed/${responseJson.items[1].id.videoId}">
  <img src="${responseJson.items[1].snippet.thumbnails['default'].url}"></a>
  <a class="myBtn" href="https://www.youtube.com/embed/${responseJson.items[2].id.videoId}">
  <img src="${responseJson.items[2].snippet.thumbnails['default'].url}"></a>`);
  renderModal();
}

function renderModal() {
  $('.myBtn').on('click', function(event) {
    event.preventDefault();
    $('#myModal').removeClass('hidden');
    const link = $(this).attr('href');
    $('.modal-content').html(`<span class="close">&times;</span><iframe width="100%" height="95%" src="${link}"></iframe>`);
    console.log('modal open');
    closeModal();
  });
}

function closeModal() {
  $('.close').on('click', function(event) {
    event.preventDefault();
    $('#myModal').addClass('hidden');
    stopModalVideo();
  });
}

function stopModalVideo() {
  $('.modal-content').find('iframe').prop('src', '');
}

function getBestBuyPrice(sku, type) {
  const apiKey = bbkey
  const url = bbUrl + sku + '.json' + '?apiKey=' + apiKey;
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => renderBestBuyPrice(responseJson, type))
    .catch(err => {
      $(`#js-render-${type}-price`).text(`Something went wrong: ${err.message}`);
    });
}

function renderBestBuyPrice(responseJson, type) {
  $(`#js-render-${type}-price`).html(`$<span class="js-price">${responseJson.regularPrice}</span>`);
  let price = $(responseJson.regularPrice);
}

function getTotalPrice(arr) {
  const totalPrice = arr.reduce(getSum);
  roundPrice(totalPrice);
}

function roundPrice(totalPrice) {
  const finalPrice = (Math.floor(totalPrice * 100) / 100);
  renderTotalPrice(finalPrice);
}

function getSum(total, num) {
  return total + num;
}

function renderTotalPrice(finalPrice) {
  $('#js-render-total-price').html(`<div>Total price: $${finalPrice}</div><div>Price does not include the prices associated with an operating system nor does it include any sales tax.</div>`);
}

function getYoutubeBuild() {
  const query = 'How to build a PC';
  const type = 'info';
  getYoutube(query, type);
}

function changeFinalPage(priceElements) {
  let arr = [];
    $('.js-render').addClass('hidden');
    $('.js-finish').removeClass('hidden');
    priceElements.each((idx, element) => {
      const el = parseFloat($(element).text(), 10);
      arr.push(el);
    });
    getTotalPrice(arr);
    getYoutubeBuild();
}

function renderParts(el) {
  $('#js-render-parts').append(`<li>${el}</li>`);
}

function splitContent(selectElements) {
  selectElements.each((idx, element) => {
    const el = $(element).find(':selected').text();
    renderParts(el);
  });
}

function submitBuild(event) {
  $('#js-pc-parts').submit(function(event) {
    event.preventDefault();
      const priceElements = $(this).find('span');
    if (priceElements.length < 7) {
      $('#js-error').html('Missing a PC component, please make sure all selections are made.');
    } else {
      const selectElements = $(this).find('select');
      splitContent(selectElements)
      changeFinalPage(priceElements);
      startNew();
    };
  });
}

function resetSelection() {
  Object.keys(STORE).forEach(type => {
    $(`#js-${type}`)[0].selectedIndex = 0;
  });
}

function resetRender() {
  Object.keys(STORE).forEach(type => {
    $(`#js-render-${type}`).empty();
    $(`#js-render-${type}-price`).empty();
    $('#js-error').empty();
  });
}

function startNew() {
  $('.js-start-new').on('click', function(event) {
    event.preventDefault();
    $('.js-finish').addClass('hidden');
    $('.js-render').removeClass('hidden');
    resetSelection();
    resetRender();
    onIntelSelection();
    onAmdSelection();
    listenSelection();
  });
}

function onStart() {
  goHome();
  startBuild();
  submitBuild();
}

$(onStart);
