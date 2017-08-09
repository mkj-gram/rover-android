/* eslint-disable */
(function (lib, img, cjs, ss, an) {

var p; // shortcut to reference prototypes
lib.ssMetadata = [];


// symbols:
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.triangle = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#D7C6FD").ss(3,1,1).p("AAABEIhPiHICfAAg");
	this.shape.setTransform(8,6.8);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.triangle, new cjs.Rectangle(-1.5,-1.5,19,16.6), null);


(lib.square = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#D7C6FD").ss(3,1,1).p("Ag8g8IB5AAIAAB5Ih5AAg");
	this.shape.setTransform(6.1,6.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.square, new cjs.Rectangle(-1.5,-1.5,15.3,15.3), null);


(lib.ring = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#D7C6FD").ss(3,1,1).p("ABNAAQAAAggWAXQgXAWggAAQgfAAgWgWQgXgXAAggQAAgfAXgWQAWgXAfAAQAgAAAXAXQAWAWAAAfg");
	this.shape.setTransform(7.7,7.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.ring, new cjs.Rectangle(-1.5,-1.5,18.4,18.4), null);


(lib.funnel = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(215,198,253,0.298)").ss(3,1,1).p("AifhNIE/AAIiCCb");
	this.shape.setTransform(45.1,16.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#D7C6FD").ss(4,1,1).p("AGDk/QADgIgCgGQgEgGgIAAIrwAAQgIAAgDAGQgDAGAEAIIElFuQAJAHAGAOQAFAMAAAIIAADnQAAANAHAGQAGAFAIgEIBpg+QAHgDAHgKQAGgLAAgIIAAidQAAgIAGgMQAGgOAJgHg");
	this.shape_1.setTransform(38.9,34);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.funnel, new cjs.Rectangle(-2,-2,81.8,72.1), null);


(lib.cross = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#D7C6FD").ss(3,1,1).p("AAAAAIg7AAAA8AAIg8AAAAAg7IAAA7IAAA8");
	this.shape.setTransform(6,6);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.cross, new cjs.Rectangle(-1.5,-1.5,15,15), null);


(lib.triangleanimation = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.triangle();
	this.instance.parent = this;
	this.instance.setTransform(8,6.8,1,1,0,0,0,8,6.8);
	this.instance.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({scaleX:0.98,scaleY:0.98,rotation:3.8,x:3.1,y:9,alpha:0.25},0).wait(1).to({scaleX:0.97,scaleY:0.97,rotation:7.5,x:-1.6,y:11.5,alpha:0.5},0).wait(1).to({scaleX:0.95,scaleY:0.95,rotation:11.3,x:-6.2,y:14.3,alpha:0.75},0).wait(1).to({scaleX:0.93,scaleY:0.93,rotation:15,x:-10.6,y:17.5,alpha:1},0).wait(1).to({scaleX:0.91,scaleY:0.91,rotation:18.8,x:-14.7,y:21},0).wait(1).to({scaleX:0.9,scaleY:0.9,rotation:22.5,x:-18.5,y:24.7},0).wait(1).to({scaleX:0.88,scaleY:0.88,rotation:26.3,x:-22.1,y:28.8},0).wait(1).to({scaleX:0.86,scaleY:0.86,rotation:30,x:-25.3,y:33.1},0).wait(1).to({scaleX:0.85,scaleY:0.85,rotation:33.8,x:-28.1,y:37.7},0).wait(1).to({scaleX:0.83,scaleY:0.83,rotation:37.5,x:-30.6,y:42.5},0).wait(1).to({scaleX:0.81,scaleY:0.81,rotation:41.3,x:-32.6,y:47.5},0).wait(1).to({scaleX:0.79,scaleY:0.79,rotation:45,x:-34.4,y:52.5},0).wait(1).to({scaleX:0.78,scaleY:0.78,rotation:48.8,x:-35.8,y:57.7},0).wait(1).to({scaleX:0.76,scaleY:0.76,rotation:52.5,x:-37,y:63},0).wait(1).to({scaleX:0.74,scaleY:0.74,rotation:56.3,x:-37.9,y:68.3},0).wait(1).to({scaleX:0.72,scaleY:0.72,rotation:60,x:-38.4,y:73.6},0).wait(1).to({scaleX:0.71,scaleY:0.71,rotation:63.8,x:-38.8,y:79},0).wait(1).to({scaleX:0.69,scaleY:0.69,rotation:67.5,x:-39,y:84.4},0).wait(1).to({scaleX:0.67,scaleY:0.67,rotation:71.3,x:-38.9,y:89.8},0).wait(1).to({scaleX:0.66,scaleY:0.66,rotation:75,x:-38.7,y:95.2},0).wait(1).to({scaleX:0.64,scaleY:0.64,rotation:78.8,x:-38.3,y:100.5},0).wait(1).to({scaleX:0.62,scaleY:0.62,rotation:82.5,x:-37.7,y:105.9},0).wait(1).to({scaleX:0.6,scaleY:0.6,rotation:86.3,x:-37,y:111.2},0).wait(1).to({scaleX:0.59,scaleY:0.59,rotation:90,x:-36.2,y:116.6},0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,19,16.6);


(lib.squareanimation = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.square();
	this.instance.parent = this;
	this.instance.setTransform(-38.2,-18.5,1,1,0,0,0,6.1,6.1);
	this.instance.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({scaleX:0.99,scaleY:0.99,rotation:-2.5,x:-32.4,y:-17.9,alpha:0.25},0).wait(1).to({scaleX:0.97,scaleY:0.97,rotation:-5,x:-26.8,y:-16.4,alpha:0.5},0).wait(1).to({scaleX:0.96,scaleY:0.96,rotation:-7.5,x:-21.4,y:-14,alpha:0.75},0).wait(1).to({scaleX:0.94,scaleY:0.94,rotation:-10,x:-16.4,y:-11,alpha:1},0).wait(1).to({scaleX:0.93,scaleY:0.93,rotation:-12.5,x:-11.9,y:-7.4},0).wait(1).to({scaleX:0.91,scaleY:0.91,rotation:-15,x:-7.5,y:-3.4},0).wait(1).to({scaleX:0.9,scaleY:0.9,rotation:-17.5,x:-3.6,y:1},0).wait(1).to({scaleX:0.88,scaleY:0.88,rotation:-20,x:0,y:5.6},0).wait(1).to({scaleX:0.87,scaleY:0.87,rotation:-22.5,x:3.3,y:10.5},0).wait(1).to({scaleX:0.85,scaleY:0.85,rotation:-25,x:6.3,y:15.5},0).wait(1).to({scaleX:0.84,scaleY:0.84,rotation:-27.5,x:9,y:20.7},0).wait(1).to({scaleX:0.82,scaleY:0.82,rotation:-30,x:11.5,y:26},0).wait(1).to({scaleX:0.81,scaleY:0.81,rotation:-32.5,x:13.7,y:31.4},0).wait(1).to({scaleX:0.79,scaleY:0.79,rotation:-35,x:15.7,y:36.9},0).wait(1).to({scaleX:0.78,scaleY:0.78,rotation:-37.5,x:17.6,y:42.4},0).wait(1).to({scaleX:0.76,scaleY:0.76,rotation:-40,x:19.3,y:48},0).wait(1).to({scaleX:0.75,scaleY:0.75,rotation:-42.5,x:20.7,y:53.7},0).wait(1).to({scaleX:0.73,scaleY:0.73,rotation:-45,x:21.9,y:59.5},0).wait(1).to({scaleX:0.72,scaleY:0.72,rotation:-47.5,x:23,y:65.2},0).wait(1).to({scaleX:0.7,scaleY:0.7,rotation:-50,x:23.9,y:71},0).wait(1).to({scaleX:0.69,scaleY:0.69,rotation:-52.5,x:24.7,y:76.8},0).wait(1).to({scaleX:0.67,scaleY:0.67,rotation:-55,x:25.2,y:82.7},0).wait(1).to({scaleX:0.66,scaleY:0.66,rotation:-57.5,x:25.6,y:88.5},0).wait(1).to({scaleX:0.64,scaleY:0.64,rotation:-60,x:25.8,y:94.3},0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-45.8,-26.1,15.3,15.3);


(lib.funnelanimation_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.funnel();
	this.instance.parent = this;
	this.instance.setTransform(38.9,68.1,1,1,0,0,0,38.9,68.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regY:34,scaleY:1,y:34},0).wait(1).to({scaleY:1,y:33.9},0).wait(1).to({scaleY:1.01},0).wait(1).to({scaleY:1.01,y:33.8},0).wait(1).to({scaleY:1.01,y:33.7},0).wait(1).to({scaleY:1.01},0).wait(1).to({scaleY:1.01,y:33.6},0).wait(1).to({scaleY:1.01,y:33.5},0).wait(1).to({scaleY:1.02},0).wait(1).to({scaleY:1.02,y:33.4},0).wait(1).to({scaleY:1.02},0).wait(1).to({scaleY:1.02},0).wait(1).to({scaleY:1.02,y:33.5},0).wait(1).to({scaleY:1.02},0).wait(1).to({scaleY:1.01,y:33.6},0).wait(1).to({scaleY:1.01},0).wait(1).to({scaleY:1.01,y:33.7},0).wait(1).to({scaleY:1.01},0).wait(1).to({scaleY:1.01,y:33.8},0).wait(1).to({scaleY:1.01},0).wait(1).to({scaleY:1.01,y:33.9},0).wait(1).to({scaleY:1},0).wait(1).to({scaleY:1,y:34},0).wait(1).to({scaleY:1},0).wait(1).to({scaleY:1},0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2,-2,81.8,72.1);


(lib.crossanimation = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.cross();
	this.instance.parent = this;
	this.instance.setTransform(9.4,9.3,1.192,1.192,0,0,0,4.9,5.1);
	this.instance.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:6,regY:6,scaleX:1.17,scaleY:1.17,rotation:6.3,x:5.3,y:11.3,alpha:0.2},0).wait(1).to({scaleX:1.15,scaleY:1.15,rotation:12.5,x:0,y:12.8,alpha:0.4},0).wait(1).to({scaleX:1.14,scaleY:1.14,rotation:18.8,x:-5.2,y:14.6,alpha:0.6},0).wait(1).to({scaleX:1.12,scaleY:1.12,rotation:25,x:-10.2,y:16.8,alpha:0.8},0).wait(1).to({scaleX:1.1,scaleY:1.1,rotation:31.3,x:-15.1,y:19.3,alpha:1},0).wait(1).to({scaleX:1.08,scaleY:1.08,rotation:37.5,x:-19.7,y:22.3},0).wait(1).to({scaleX:1.06,scaleY:1.06,rotation:43.8,x:-24.1,y:25.5},0).wait(1).to({scaleX:1.04,scaleY:1.04,rotation:50,x:-28.2,y:29.1},0).wait(1).to({scaleX:1.02,scaleY:1.02,rotation:56.3,x:-32,y:32.9},0).wait(1).to({scaleX:1,scaleY:1,rotation:62.5,x:-35.5,y:37},0).wait(1).to({scaleX:0.98,scaleY:0.98,rotation:68.8,x:-38.6,y:41.4},0).wait(1).to({scaleX:0.96,scaleY:0.96,rotation:75,x:-41.4,y:45.9},0).wait(1).to({scaleX:0.94,scaleY:0.94,rotation:81.3,x:-43.9,y:50.5},0).wait(1).to({scaleX:0.93,scaleY:0.93,rotation:87.5,x:-46.1,y:55.3},0).wait(1).to({scaleX:0.91,scaleY:0.91,rotation:93.8,x:-47.9,y:60.2},0).wait(1).to({scaleX:0.89,scaleY:0.89,rotation:100,x:-49.5,y:65.2},0).wait(1).to({scaleX:0.87,scaleY:0.87,rotation:106.3,x:-50.8,y:70.3},0).wait(1).to({scaleX:0.85,scaleY:0.85,rotation:112.5,x:-51.8,y:75.4},0).wait(1).to({scaleX:0.83,scaleY:0.83,rotation:118.8,x:-52.5,y:80.5},0).wait(1).to({scaleX:0.81,scaleY:0.81,rotation:125,x:-53.1,y:85.7},0).wait(1).to({scaleX:0.79,scaleY:0.79,rotation:131.3,x:-53.3,y:90.8},0).wait(1).to({scaleX:0.77,scaleY:0.77,rotation:137.5,x:-53.4,y:96.1},0).wait(1).to({scaleX:0.75,scaleY:0.75,rotation:143.8,x:-53.3,y:101.2},0).wait(1).to({scaleX:0.73,scaleY:0.73,rotation:150,x:-53,y:106.5},0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(1.7,1.4,17.9,17.9);


(lib.circleanimation = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.ring();
	this.instance.parent = this;
	this.instance.setTransform(-43.7,-56.7,0.968,0.968);
	this.instance.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:7.7,regY:7.7,scaleX:0.95,scaleY:0.95,x:-29.8,y:-50.2,alpha:0.25},0).wait(1).to({scaleX:0.93,scaleY:0.93,x:-23.3,y:-50.6,alpha:0.5},0).wait(1).to({scaleX:0.91,scaleY:0.91,x:-16.8,y:-50.4,alpha:0.75},0).wait(1).to({scaleX:0.89,scaleY:0.89,x:-10.4,y:-49.5,alpha:1},0).wait(1).to({scaleX:0.87,scaleY:0.87,x:-4.1,y:-48},0).wait(1).to({scaleX:0.85,scaleY:0.85,x:2,y:-45.7},0).wait(1).to({scaleX:0.83,scaleY:0.83,x:7.6,y:-42.7},0).wait(1).to({scaleX:0.82,scaleY:0.82,x:13,y:-39.1},0).wait(1).to({scaleX:0.8,scaleY:0.8,x:17.9,y:-34.9},0).wait(1).to({scaleX:0.78,scaleY:0.78,x:22.3,y:-30.2},0).wait(1).to({scaleX:0.76,scaleY:0.76,x:26.3,y:-25.1},0).wait(1).to({scaleX:0.74,scaleY:0.74,x:29.8,y:-19.7},0).wait(1).to({scaleX:0.72,scaleY:0.72,x:32.9,y:-14.1},0).wait(1).to({scaleX:0.7,scaleY:0.7,x:35.6,y:-8.2},0).wait(1).to({scaleX:0.68,scaleY:0.68,x:38,y:-2.2},0).wait(1).to({scaleX:0.66,scaleY:0.66,x:40,y:4},0).wait(1).to({scaleX:0.64,scaleY:0.64,x:41.7,y:10.2},0).wait(1).to({scaleX:0.62,scaleY:0.62,x:43.1,y:16.5},0).wait(1).to({scaleX:0.61,scaleY:0.61,x:44.3,y:22.8},0).wait(1).to({scaleX:0.59,scaleY:0.59,x:45.3,y:29.3},0).wait(1).to({scaleX:0.57,scaleY:0.57,x:46,y:35.7},0).wait(1).to({scaleX:0.55,scaleY:0.55,x:46.6,y:42.2},0).wait(1).to({scaleX:0.53,scaleY:0.53,x:46.9,y:48.7},0).wait(1).to({scaleX:0.51,scaleY:0.51,x:47.2,y:55.2},0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-45.2,-58.2,17.8,17.8);


// stage content:
(lib.funnelanimation = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{stop:19,restart:20});

	// timeline functions:
	this.frame_19 = function() {
		/* Stop a Movie Clip
		Stops the specified movie clip on stage.
		
		Instructions:
		1. Use this code for movie clips that are currently playing.
		*/
		
		this.stopClips = function (){
			this.ob4.stop();
			this.ob3.stop();
			this.ob2.stop();
			this.ob1.stop();
			this.funnel.stop();
		}
		
		this.playClips = function (){
			this.ob4.play();
			this.ob3.play();
			this.ob2.play();
			this.ob1.play();
			this.funnel.play();
		}
		
		
		
		this.stopClips();
		this.stop();
		
		canvasTimeline = this;
	}
	this.frame_20 = function() {
		this.playClips();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(19).call(this.frame_19).wait(1).call(this.frame_20).wait(9));

	// Layer 7 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("At5ImIAAxLIbzAAIAARLg");
	mask.setTransform(90,57.8);

	// circle
	this.ob4 = new lib.circleanimation();
	this.ob4.parent = this;
	this.ob4.setTransform(60.2,88.8,1,1,0,0,0,7.5,7.5);
	this.ob4._off = true;

	var maskedShapeInstanceList = [this.ob4];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.ob4).wait(4).to({_off:false},0).wait(25));

	// cross
	this.ob3 = new lib.crossanimation();
	this.ob3.parent = this;
	this.ob3.setTransform(144,21.2,1,1,0,0,0,6,6);

	var maskedShapeInstanceList = [this.ob3];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.ob3).wait(29));

	// Layer 6
	this.ob2 = new lib.triangleanimation();
	this.ob2.parent = this;
	this.ob2.setTransform(117.7,13.7,1,1,0,0,0,8,6.8);
	this.ob2._off = true;

	var maskedShapeInstanceList = [this.ob2];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.ob2).wait(9).to({_off:false},0).wait(20));

	// Layer 3
	this.ob1 = new lib.squareanimation();
	this.ob1.parent = this;
	this.ob1.setTransform(86.1,36.8,1,1,0,0,0,6.1,6.1);
	this.ob1._off = true;

	var maskedShapeInstanceList = [this.ob1];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.ob1).wait(14).to({_off:false},0).wait(15));

	// Funnel
	this.funnel = new lib.funnelanimation_1();
	this.funnel.parent = this;
	this.funnel.setTransform(86.8,148.5,1,1,0,0,0,38.9,34);

	this.timeline.addTween(cjs.Tween.get(this.funnel).wait(29));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(135.9,116.5,111.7,168.1);
// library properties:
lib.properties = {
	width: 180,
	height: 200,
	fps: 24,
	color: "#5C5D5C",
	opacity: 1.00,
	manifest: [],
	preloads: []
};




})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{}, AdobeAn = AdobeAn||{});
var lib, images, createjs, ss, AdobeAn;