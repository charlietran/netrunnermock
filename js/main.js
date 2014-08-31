var NF = NF || {};

NF.options = {
  image_host: 'http://www.netrunnerdb.com'
}

NF.elements = {
  desktop:                  $('#desktop'),
  background_chooser:       $('#background-chooser'),
  background_chooser_links: $('#background-chooser > li > a'),
  runner_grid:              $('#runner-grid'),
  corp_grid:                $('#corp-grid'),
  search_runner:            $('#runner-search')
};

NF.grids = {
  options: {
    widget_selector: '.card',
    widget_base_dimensions: [150, 209],
    autogrow_cols: true,
    resize: { enabled: true }
  }
};

NF.populateCards = function(self) {
  self.Cards = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 10,
    prefetch: {
      url: 'cards.json',
      filter: function(card_list) {
        return $.map(card_list,
          function(card) {
            return {
              title: card.title,
              code: card.code,
              text: card.text.replace("\n","<br><br>")
          };
        });
      }
    }
  });
  self.Cards.initialize();
  self.elements.search_runner.typeahead({
    hint: false,
    highlight: true,
    minLength: 1
  }, {
    name: 'Cards',
    displayKey: 'title',
    source: self.Cards.ttAdapter(),
    templates: {
      suggestion: function(context) { return Mustache.render(self.templates.suggestion, context); }
    }
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
  self.templates.suggestion = $('#suggestion-template').html();
  Mustache.parse(self.templates.suggestion);
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

NF.addCard = function(card, side, self) {
  var card_data = {
    image_url: self.options.image_host + card.imagesrc,
    card_title: card.title,
    card_text: card.text.replace("\n", "<br><br>")
  };
  var card_html = Mustache.render(self.templates.card, card_data);
  self.grids[side].add_widget(card_html, 1, 1);
  self.elements.desktop.foundation();
};

NF.bindEvents = function(self) {
  self.elements.search_runner.on('typeahead:selected', function(event, card, dataset) {
    self.addCard(card, card.side.toLowerCase(), self);
  });
};


NF.ready = function() {
  var self = this;
  self.setupTemplates(self);
  self.populateCards(self);
  self.setupGrid(self);
  self.setupBgChooser();
  self.bindEvents(self);
};

$(function(){
  NF.ready();
  $(document).foundation();
});