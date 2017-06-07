
DoICare = function ( id, start, hintTime ) {
    var self = this;
    this.hintTime = hintTime==undefined? 25000 : hintTime;
    var div = $('<div id="'+id+'">\n<div class="container">\n<div class="col-md-2"></div>\n<div class="col-md-8">\n<h4>How much do you want to read? <input type="range" min="1" max="5" step="1" value="5"> (<span></span>)</h4>\n<img src="/s/images/hand-arrow.png" width="200px" style="position:relative;top: -10px;left: -190px;display:none;">\n</div>\n<div class="col-md-2"></div>\n</div>\n</div>');
    $('body').append(div);
    this.id = '#'+id
    this.img = $(self.id + ' img');
    this.doOnUpdate = [];
    this.initialize(start);
    this.hasChanged = false;
    this.img.on('mouseenter',function(){self.img.fadeOut();self.hasChanged=true;});
};


DoICare.prototype = {

    constructor: DoICare,

    initialize: function(start){
        var CL = $(this.id + ' input').val(start);
        var self = this;
        $('[icare]').hide();
        this.update();
        $(this.id + ' input').on('change',function(){self.update();})
        setTimeout(function(){if(!self.hasChanged){self.img.fadeIn();}},this.hintTime);
    },

    update: function(){
        var CL = $(this.id + ' input').val();
        $(this.id + ' img').fadeOut();
        this.hasChanged = true;
        $(this.id + ' span').html(['a picture', 'a wee bit', 'goldilocks', 'the important stuff', 'annoying details'][CL-1])
        $('[icare]').each(function(i,c){
            c = $(c);
            var sign = c.attr('icare')[0];
            var lev = parseFloat(c.attr('icare')[1]);
            var show = false;
            if(sign === '='){show = lev == CL;}
            else if(sign === '<'){show = CL < lev;}
            else if(sign === '>'){show = CL > lev;}
            if(show){c.fadeIn();}else{c.fadeOut();}
        });
        for (var i = 0; i < this.doOnUpdate.length; i++) {
            this.doOnUpdate[i](CL);
        };
    },

    onUpdate: function(f){
        this.doOnUpdate.push(f);
    },
};
