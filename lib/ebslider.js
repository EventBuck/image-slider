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
	 function List(){
	 	List.makeNode = function(data){
	 		return {data:data, previous:null, next:null};
	 	};
	 	this.start = null;
	 	this.end = null;


	 }
	 List.prototype = {
	 	add: function(data){
	 		if(this.start === null){
	 			this.start = List.makeNode(data);
	 			this.end = this.start;
	 			this.start.previous = this.end;
	 			this.start.next = this.end;
	 			this.end.previous = this.start;
	 			this.end.next = this.start;
	 		}
	 		else{
	 			var next = this.end.next;
	 			this.end.next = List.makeNode(data);
	 			this.end.next.previous = this.end;
	 			this.end = this.end.next;
	 			this.end.next = next;
	 			this.end.next.previous = this.end;
	 		}
	 	},

	 	delete: function(node){
	 		node.previous.next = node.next;
	 		node.next.previous = node.previous;
	 	},
	 	each: function(f){
	 		f(this.start);
	 		var current = this.start.next;
	 		while(current !== this.start){
	 			f(current);
	 			current = current.next;
	 		}

	 	}
	 }
	 var methods = {
		 init: function(settings){
			 return this.each(function(){
				this.events = new List(); 
				this.more = false;
				this.opt = $.extend(true, $.fn.ebslider.defaults, settings);
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

				this.prevDiv = $(document.createElement("div")).addClass("eb-placeholder prev-placeholder");
				this.centralDiv = $(document.createElement("div")).addClass("eb-placeholder central-placeholder");
				this.nextDiv = $(document.createElement("div")).addClass("eb-placeholder next-placeholder");
				this.current = this.events.start;
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
			 	var mainDiv = $(document.createElement("div")).addClass('ebBlock');
				var caption = $(document.createElement("div")).addClass("caption").html(content[i].caption);
				var imageSource = content[i].imageUrl;
				var alt  = content[i].alt;
				var image = $(document.createElement("img")).attr("src",imageSource).attr("alt", alt);

				mainDiv.html(image).append(caption);
				$(this).append(mainDiv);
				this.events.add(mainDiv);
			}
		 },
		 _next: function(){
		 	 if(this.current === this.events.end || this.current.next === this.events.end){

		 	 	if (methods._canFetchMore.call(this))
			 	 {
					methods._fetchMore(function(){
						this.nextDiv.html(this.events[this.cursor].image).append(this.events[this.cursor].caption);
					});
			 	 }
			}

		 	 this.current.previous.data.removeClass(this.opt.prevContainer).addClass('hasPassed');
		 	 this.current.data.removeClass(this.opt.centralContainer).addClass(this.opt.prevContainer);
		 	 this.current.next.data.removeClass(this.opt.nextContainer).addClass(this.opt.centralContainer);
		 	 this.current = this.current.next;
		 	 this.current.next.data.removeClass('hasPassed').addClass(this.opt.nextContainer);
		 	 
		 },
		 _startSlider: function(){
		 	 this.current.previous.data.addClass(this.opt.prevContainer);
		 	 this.current.data.addClass(this.opt.centralContainer);
		 	 this.current.next.data.addClass(this.opt.nextContainer);
		 	 var $this = this;
			 this.timer = setInterval(function(){methods._next.call($this);}, $this.opt.timer);
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
		
		timer:5000,
	};

	 
 })(jQuery);