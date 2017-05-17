$(document).ready(function () {

  $.ajaxSetup({
    headers: {
      'Accept': 'application/json'
    }
  });

  var quotesApi = "https://crossorigin.me/http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=en";
  var quoteBox = $('.quote .quote-content');
  var html = quoteBox.html();
  var spinner = "<p class='spinner'><img src='img/spin.gif' alt='Loading'></p>";
  var tweet = "https://twitter.com/intent/tweet?text=";

  // replace text in the supplied html using the specified attr(strin) with a value.
  function replaceText(attr, html, value) {
    var replace = "{{" + attr + "}}";
    html = html.replace(new RegExp(replace, 'g'), value);
    return html;
  }

  // get quote data from json api.
  function getData() {
    loadSpinner(quoteBox);
    $.getJSON(quotesApi)
      .done(function (data) {
        console.log(data);
        setHtml(data.quoteAuthor, data.quoteText);
      });
  }

  // set html with provided data in place.
  function setHtml(author, quote) {
    var quoteHtml = html;
    quoteHtml = replaceText('author', quoteHtml, author);
    quoteHtml = replaceText('quote', quoteHtml, quote);

    quoteBox.html(quoteHtml);

    var newTweet = tweet;
    newTweet += encodeURIComponent(author + " said: \"" + quote.replace(/<p>|<\/p>|\n/g, "") + "\"");
    setTweet($("#tweet"), newTweet);

    actions('block');
    setColors($('body'));
    setColors($('h1, .quote'));
  }

  // set tweet link.
  function setTweet(linkElem, tweet) {
    linkElem.attr("href", tweet);
  }

  // put gif spinner in supplied element.
  function loadSpinner(elem) {
    elem.html(spinner);
    actions('none');
  }

  // set display state of action buttons.
  function actions(state) {
    $('.quote-actions').css({display: state});
  }

  // set background color and text color.
  function setColors(elem) {
    var colors = genColor();
    var bg = colors.bg;
    var text = colors.text;
    elem.animate({
      backgroundColor: bg,
      color: text
    });
  }

  // generate random color.
  function genColor() {
    var colors = {};

    var r = randomInt();
    var g = randomInt();
    var b = randomInt();

    var color = "rgb(" + r + "," + g + "," + b + ")";
    colors.bg = color;

    var avg = (r+g+b) / 3;
    if (avg < 170) {
      colors.text = "#fff";
    } else {
      colors.text = "#000";
    }

    return colors;
  }

  // get random integer default range (0 to 255).
  function randomInt(min, max) {
    if (!min)
      min = 0;
    if (!max)
      max = 256;

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // quote reload button.
  $("#reload").on('click', function (e) {
    e.preventDefault();
    getData();
  });

  // get quote data on dom load.
  getData();
});
