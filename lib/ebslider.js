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
				this.carousel = $(document.createElement("section")).addClass('ebCarousel');
				this.animationClasses = ['hasPassed-forward', 'hasPassed-backward', 'prevContainer-forward', 'prevContainer-backward', 
		 		'centralContainer-forward', 'centralContainer-backward', 'nextContainer-forward', 'nextContainer-backward'];
				if(typeof this.opt.content === "function")
				{
					methods._fetchMore.call(this);
				}
				else if($.isArray(this.opt.content))
				{
					methods._initContent.call(this, this.opt.content);
				}

				this.prevDiv = $(document.createElement("div")).addClass("eb-placeholder prev-placeholder");
				this.centralDiv = $(document.createElement("div")).addClass("eb-placeholder central-placeholder");
				this.nextDiv = $(document.createElement("div")).addClass("eb-placeholder next-placeholder");
				
				console.log(this.carrousel);
				this.current = this.events.start;
				var $this = $(this);
				//$this.append([this.prevDiv, this.centralDiv, this.nextDiv]);
				$this.addClass('ebslider');
				$this.append(this.carousel);
				methods._startSlider.call(this);
				methods._initControl.call(this);
				methods._binds.call(this);
			 });
			 
		 },

		 _canFetchMore: function()
		 {
			 return typeof this.opt.content === "function" && this.more;
			 
		 },
		 _bindControl: function()
		 {
		 	
		 	var that = this;
		 	this.nextButton.on('click.ebslider', function(evt){
		 		methods.next.call(that);
		 	});
		 	this.previousButton.on('click.ebslider', function(evt){
		 		console.log('previous button clicked');
		 		methods.previous.call(that);
		 	})

		 },
		 _bindMouseOut: function()
		 {
		 	var $this = $(this);
		 	$this.on('mouseleave.ebslider', function(evt){
		 		methods.play.call(this);
		 	});
		 },
		 _bindMouseOver: function()
		 {
		 	var $this = $(this);
		 	$this.bind('mouseover.ebslider', function(evt){
		 		methods.stop.call(this);
		 	});
		 },
		 _binds: function(){
		 	methods._bindMouseOver.call(this);
		 	methods._bindMouseOut.call(this);
		 	methods._bindControl.call(this);
		 },
		 _fetchMore: function(){
		 	var results = this.opt.content.apply(null, this.events.length)
			var content = results.content;
			this.more = results.more;
			methods._initContent.call(this, content);

		 },
		 _initContent: function(content){
			 for(var i = 0; i < content.length; i++){
			 	var mainDiv = $(document.createElement("div")).addClass('ebBlock');
				var caption = $(document.createElement("div")).addClass("caption").html(content[i].caption);
				var imageSource = content[i].imageUrl;
				var alt  = content[i].alt;
				var image = $(document.createElement("figure")).append($(document.createElement("img")).attr("src",imageSource).attr("alt", alt));

				mainDiv.html(image).append(caption);
				this.carousel.append(mainDiv);
				this.events.add(mainDiv);
			}
		 },
		 _initControl:function(){
		 	this.controlBlock = $(document.createElement("section")).addClass('ebControl');
		 	this.previousButton = $(document.createElement("a")).text("<<");
		 	this.pauseButton = $(document.createElement("a")).text('||');
			this.nextButton = $(document.createElement("a")).text(">>");
			this.controlBlock.append(this.previousButton, this.pauseButton, this.nextButton);
			$(this).append(this.controlBlock);

		 },
		 next: function(){
		 	 if(this.current === this.events.end || this.current.next === this.events.end){

		 	 	if (methods._canFetchMore.call(this))
			 	 {
					methods._fetchMore.call(this);
			 	 }
			}
			 methods._removeAllAnimationClasses.call(this);
		 	 this.current.previous.data.removeClass(this.opt.prevContainer).addClass('hasPassed hasPassed-forward');
		 	 this.current.data.removeClass(this.opt.centralContainer).addClass(this.opt.prevContainer+ ' prevContainer-forward');
		 	 this.current.next.data.removeClass(this.opt.nextContainer).addClass(this.opt.centralContainer+ ' centralContainer-forward');
		 	 this.current = this.current.next;
		 	 this.current.next.data.removeClass('hasPassed').addClass(this.opt.nextContainer + ' nextContainer-forward');
		 	 
		 },
		 play: function()
		 {
		 	var that = this;
		 	this.timer = setInterval(function(){methods.next.call(that);}, that.opt.timer);
		 },
		 previous:function()
		 {
		 	methods._removeAllAnimationClasses.call(this);
		 	this.current.next.data.removeClass(this.opt.nextContainer).addClass('hasPassed hasPassed-backward');
		 	this.current.data.removeClass(this.opt.centralContainer).addClass(this.opt.nextContainer  + ' nextContainer-backward');
		 	this.current.previous.data.removeClass(this.opt.prevContainer).addClass(this.opt.centralContainer + ' centralContainer-backward');
		 	this.current.previous.previous.data.removeClass('hasPassed').addClass(this.opt.prevContainer+ ' prevContainer-backward');
		 	this.current = this.current.previous;
		 },
		 _removeAllAnimationClasses:function()
		 {
		 	 var that = this;
		 	 this.animationClasses.forEach(function(animation){
		 	 	if(that.current.previous.previous.data.hasClass(animation)){
		 	 		that.current.previous.previous.data.removeClass(animation);
		 	 	}
		 	 	if(that.current.previous.data.hasClass(animation)){
		 	 		that.current.previous.data.removeClass(animation);
		 	 	}
		 	 	if(that.current.data.hasClass(animation)){
		 	 		that.current.data.removeClass(animation);
		 	 	}
		 	 	if(that.current.next.data.hasClass(animation)){
		 	 		that.current.next.data.removeClass(animation);
		 	 	}
		 	 	if(that.current.next.next.data.hasClass(animation)){
		 	 		that.current.next.next.data.removeClass(animation);
		 	 	}
		 	 });

		 },
		 _startSlider: function(){
		 	 this.current.previous.data.addClass(this.opt.prevContainer + ' prevContainer-forward');
		 	 this.current.data.addClass(this.opt.centralContainer + ' centralContainer-forward');
		 	 this.current.next.data.addClass(this.opt.nextContainer + ' nextContainer-forward');
		 	 methods.play.call(this);
		 },
		 
		 stop: function()
		 {
		 	clearInterval(this.timer);
		 }
		 
		 
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
		
		timer:4000,
	};

	 
 })(jQuery);