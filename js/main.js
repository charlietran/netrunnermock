var NF = NF || {};

NF.options = {
  image_host: 'http://www.netrunnerdb.com'
}

NF.elements = {
  desktop:                  $('#desktop'),
  background_chooser:       $('#background-chooser'),
  background_chooser_links: $('#background-chooser > li > a')
};


NF.setupBgChooser = function() {
  var self = this;
  self.elements.background_chooser_links.on('click', function() { NF.changeBg(this, self) });
}

NF.changeBg = function(el, self) {
  event.preventDefault();
  var $this = $(el);
  self.elements.desktop.css('background-image', 'url(' + $this.data('url') + ')');
  console.log($this.data('url'));
};

NF.addCard = function(card) {
  var self = this
  var template = $("#card-template").html();
  Mustache.parse(template);
  var context = {image_url: self.options.image_host + card.imagesrc}
  var card_html = Mustache.render(template, context);

  self.elements.desktop.append(card_html);
};

NF.populateCards = function() {
  $.getJSON('cards.json', function(card_data){
    NF.Cards = TAFFY(card_data);
  });
};

NF.ready = function() {
  NF.populateCards();
  NF.setupBgChooser();
};

$(function(){
  NF.ready();
  $(document).foundation();
});