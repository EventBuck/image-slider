/*!
 * jQuery ebslider - An Image slider plugin
 *
 * Licensed under The MIT License
 *
 * @author  : Aristote Diasonama
 * @doc     : None
 * @version : 0.1
 *
 */
 
 (function($) {
	 
	 var methods = {
		 init: function(settings){
			 return this.each(function(){
				this.events = []; 
				this.cursor = 0;
				this.more = false;
				this.opt = $.extend(true, $.fn.ebslider.defaults, settings);
				this.prevDiv = $(document.createElement("div")).addClass(this.opt.prevContainer);
				this.nextDiv = $(document.createElement("div")).addClass(this.opt.nextContainer);
				this.centralDiv = $(document.createElement("div")).addClass(this.opt.centralContainer);
				
				if(typeof this.opt.content === "function")
				{
					var results = this.opt.content.apply(null, this.events.length)
					var content = results.content;
					this.more = results.more;
					methods._initContent.call(this, content);
				}
				else if($.isArray(this.opt.content))
				{
					methods._initContent.call(this, this.opt.content);
				}
				
				
				
				var $this = $(this);
				$this.append([this.prevDiv, this.centralDiv, this.nextDiv]);
				$this.addClass('ebslider');
				methods._startSlider.call(this);
				
			 });
			 
		 },
		 _canFetchMore: function()
		 {
			 return typeof this.opt.content === "function" && this.more;
			 
		 },
		 _initContent: function(content){
			 for(var i = 0; i < content.length; i++){
				var caption = $(document.createElement("div")).addClass("caption").html(content[i].caption);
				var imageSource = content[i].imageUrl;
				var alt  = content[i].alt;
				var image = $(document.createElement("img")).attr("src",imageSource).attr("alt", alt);
				this.events.push({'image':image, 'caption':caption});
			}
		 },
		 _next: function(){
			 if(this.cursor == 0)
			 {
				 this.prevDiv.html(this.events[this.events.length-1].image).append(this.events[this.events.length-1].caption);
			 }
			 if(this.cursor > 0)
			 {
				 this.prevDiv.html(this.events[this.cursor-1].image).append(this.events[this.cursor-1].caption);
			 }

			 this.centralDiv.html(this.events[this.cursor].image).append(this.events[this.cursor].caption);
			 
			 this.cursor += 1;
			 
			 if(this.cursor < this.events.length)
			 {
				 this.nextDiv.html(this.events[this.cursor].image).append(this.events[this.cursor].caption);
			 }
			 
			 else if(this.cursor === this.events.length)
			 {
				 if (methods._canFetchMore())
			 	 {
					methods._fetchMore(function(){
						this.nextDiv.html(this.events[this.cursor].image).append(this.events[this.cursor].caption);
					});
			 	 }
				else
				{
					this.cursor = 0;
					this.nextDiv.html(this.events[this.cursor].image).append(this.events[this.cursor].caption);
				}
				
			 }
			 
			 
			 
		 },
		 _startSlider: function(){
			 this.timer = setInterval(methods._next.call(this), this.opt.timer);
		 },
		 
		 
		 
	 };
	 
	$.fn.ebslider = function(method) {
    	if (methods[method]) {
      		return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    	} else if (typeof method === 'object' || !method) {
      		return methods.init.apply(this, arguments);
    	} else {
      		$.error('Method ' + method + ' does not exist!');
    	}
    };
  
	$.fn.ebslider.defaults = {
		prevContainer: "prevContainer",
		nextContainer: "nextContainer",
		centralContainer: "centralContainer",
		
		timer:10
	};

	 
 })(jQuery);