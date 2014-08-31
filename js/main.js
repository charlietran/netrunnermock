var NF = NF || {};

NF.options = {
  image_host: 'http://www.netrunnerdb.com',
  width: 150,
  height: 209
}

NF.elements = {
  desktop:            $('#desktop'),
  background_chooser: $('#background-chooser'),
  background_links:   $('#background-chooser > li > a'),
  grid:               $('#grid'),
  search_input:       $('#runner-search'),
  size_input:         $('#card-size')
};

NF.populateCards = function(self) {
  self.Cards = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title', 'code'),
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
              text: card.text.replace("\n","<br><br>"),
              imagesrc: card.imagesrc
          };
        });
      }
    }
  });
  self.Cards.initialize();
  self.elements.search_input.typeahead({
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

NF.changeBg = function(el, self) {
  event.preventDefault();
  var $this = $(el);
  self.elements.desktop.css('background-image', 'url(' + $this.data('url') + ')');
  console.log($this.data('url'));
};

NF.addCard = function(card, self) {
  var card_data = {
    image_url: self.options.image_host + card.imagesrc,
    card_title: card.title,
    card_text: card.text.replace("\n", "<br><br>")
  };
  var card_el = $(Mustache.render(self.templates.card, card_data));
  card_el.draggable({
    grid: [20, 20],
    start: function() {
      $('.tooltip').fadeOut(150);
    },

  });
  card_el.on('click', function(event) {
    if (event.shiftKey) {
      $(this).transit({ rotate: '+=90'});
    }
    if (event.metaKey) {
      $(this).remove();
    }
  });

  self.elements.grid.append(card_el).foundation('tooltip');
};

NF.bindEvents = function(self) {
  self.elements.search_input.on('typeahead:selected', function(event, card, dataset) {
    self.addCard(card, self);
    $(this).val('');
  });

  self.elements.background_links.on('click', function() {
    self.changeBg(this, self)
  });

  self.elements.size_input.on('change keyup', function(event) {
    var cards = $('.card'),
        multiplier = parseFloat($(this).val());

    cards.each(function(){
      var card = $(this);
      card.css('width',  multiplier * self.options.width).
           css('height', multiplier * self.options.height).
           css('margin-top', (multiplier-1) * parseFloat(card.css('top'))).
           css('margin-left', (multiplier-1) * parseFloat(card.css('left')));
    });
  });
};


NF.ready = function() {
  var self = this;
  self.setupTemplates(self);
  self.populateCards(self);
  self.bindEvents(self);
};

$(function(){
  NF.ready();
  $(document).foundation();
});