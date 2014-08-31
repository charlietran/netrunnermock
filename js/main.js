var NF = NF || {};

NF.options = {
  image_host: 'http://www.netrunnerdb.com'
}

NF.elements = {
  desktop:                  $('#desktop'),
  background_chooser:       $('#background-chooser'),
  background_chooser_links: $('#background-chooser > li > a'),
  runner_grid:              $('#runner-grid'),
  corp_grid:                $('#corp-grid')
};

NF.grids = {
  options: {
    widget_selector: '.card',
    widget_base_dimensions: [150, 209],
    autogrow_cols: true,
    resize: { enabled: true }
  }
};

NF.populateCards = function() {
  $.getJSON('cards.json', function(card_data){
    NF.Cards = TAFFY(card_data);
  });
};

NF.setupGrid = function(self) {
  self.grids.runner = self.elements.runner_grid.gridster(self.grids.options).data('gridster');
  self.grids.corp = self.elements.corp_grid.gridster(self.grids.options).data('gridster');
};

NF.setupTemplates = function(self) {
  self.templates = self.templates || {};
  self.templates.card = $("#card-template").html();
  Mustache.parse(self.templates.card);
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

NF.addCard = function(card, side) {
  var self = this;
  var card_data = {
    image_url: self.options.image_host + card.imagesrc,
    card_title: card.title,
    card_text: card.text.replace("\n", "<br><br>")
  };
  var card_html = Mustache.render(self.templates.card, card_data);
  self.grids[side].add_widget(card_html, 1, 1);
  self.elements.desktop.foundation();
};


NF.ready = function() {
  var self = this;
  NF.populateCards();
  NF.setupGrid(self);
  NF.setupTemplates(self);
  NF.setupBgChooser();
};

$(function(){
  NF.ready();
  $(document).foundation();
});