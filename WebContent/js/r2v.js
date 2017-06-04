
$(document).ready(function(){
	
	sigma.utils.pkg('sigma.canvas.nodes');
	
	sigma.canvas.nodes.image = (function() {
	  var _cache = {},
	      _loading = {},
	      _callbacks = {};

	  // Return the renderer itself:
	  var renderer = function(node, context, settings) {
		  
	    var args = arguments,
	        prefix = settings('prefix') || '',
	        size = node[prefix + 'size'],
	        color = node.color || settings('defaultNodeColor'),
	        url = node.url;

	    if (_cache[url]) {
	      context.save();

	      // Draw the clipping disc:
	      context.beginPath();
	      context.arc(
	        node[prefix + 'x'],
	        node[prefix + 'y'],
	        node[prefix + 'size'],
	        0,
	        Math.PI * 2,
	        true
	      );
	      context.closePath();
	      context.clip();

	      // Draw the image
	      context.drawImage(
	        _cache[url],
	        node[prefix + 'x'] - size,
	        node[prefix + 'y'] - size,
	        2 * size,
	        2 * size
	      );

	      // Quit the "clipping mode":
	      context.restore();

	      var percentageVisited;
	      
	      console.log(Game.posStars);
	      
	      if (Game.posStars[node.id]){
	    	  
		      var star = Game.posStars[node.id];
		      
		      percentageVisited = star.visited / Config.getTotalPlayers();	    	  
	    	  
	      } else {
	    	  
	    	  percentageVisited = 1;
	    	  
	      }
	      
	      // Draw the border:
	      context.beginPath();
	      context.arc(
	        node[prefix + 'x'],
	        node[prefix + 'y'],
	        node[prefix + 'size'],
	        0,
	        percentageVisited * (Math.PI * 2),
	        false
	      );
	      context.lineWidth = size / 3;
	      context.strokeStyle = '#282828';
	      context.stroke();
	      
	      // Draw the border:
	      context.beginPath();
	      context.arc(
	        node[prefix + 'x'],
	        node[prefix + 'y'],
	        node[prefix + 'size'] - size / 3,
	        0,
	        Math.PI * 2,
	        false
	      );
	      context.lineWidth = size / 3;
	      context.strokeStyle = node.color || settings('defaultNodeColor');
	      context.stroke();	      
	    } else {
	      sigma.canvas.nodes.image.cache(url);
	      sigma.canvas.nodes.def.apply(
	        sigma.canvas.nodes,
	        args
	      );
	    }
	  };

	  // Let's add a public method to cache images, to make it possible to
	  // preload images before the initial rendering:
	  renderer.cache = function(url, callback) {
	    if (callback)
	      _callbacks[url] = callback;

	    if (_loading[url])
	      return;

	    var img = new Image();

	    img.onload = function() {
	      _loading[url] = false;
	      _cache[url] = img;

	      if (_callbacks[url]) {
	        _callbacks[url].call(this, img);
	        delete _callbacks[url];
	      }
	    };

	    _loading[url] = true;
	    img.src = url;
	  };

	  return renderer;
	})();
	
	$("#sbut1").click(function() {
		
		Game.start();
		
	});	
	
	$("#sbut6").click(function() {
		
		Game.stop();
		
	});
	
	$.ajax({
	    type: "GET",  
	    url: "http://localhost:8080/R2V/graph1.html",
	    dataType: "json",
	    success: function(data) {
	    	
	    	Graph.init(data);
	    	
	    }
	});
	
});

Game = {
		
	interval: null,
	
	initialized: false,
	
	position: null,
	
	//history: [],
	
	scoresTmpl: null,
	
	robotsTmpl: null,
	
	posPlayers: [],
	
	posStars: [],
	
	init: function(){
		
		var exportMin = Graph.exportMin();
		
		$.ajax({
		    type: "POST",  
		    url: "http://localhost:8080/R2V/init",
		    data: { min: exportMin, start: Config.startingNodeId, creds: Config.startingCredits, rnds: Config.totRandomBots, rush: Config.totRushBots},
		    dataType: "json",
		    success: function(data) {
		    	
		    	Game.initialized = true;
		    	
				$.each(data.stars, function(i,star){
					
					Graph.s.graph.nodes(star.name).type = 'image';
					
					Graph.s.graph.nodes(star.name).url = Graph.images[star.colorIndex];			
					
				});	    	
		    	
		    }
		});
		
	},
	
	move: function(){
		$.ajax({
		    type: "POST",  
		    url: "http://localhost:8080/R2V/ctrl",
		    data: { cmult: Config.costMultiplier, stbon: Config.stayingBonus, newsc: Config.newStarScore },
		    dataType: "json",
		    success: function(data) {
		    	
		    	if (data.crowds)
		    		
		    		Game.newPosition(data);
		    	
		    }
		});
		
	},
	
	newPosition: function(data){
		
		if (Game.position == null){
			
			Game.position = data;			
			
		} else {
			
			$.observable(Game.position).setProperty("crowds",data.crowds);
			
			$.observable(Game.position).setProperty("players",data.players);
			
			$.observable(Game.position).setProperty("robots",data.robots);
			
		}
		
		if (Game.scoresTmpl == null){
			
			Game.scoresTmpl = $.templates("#scoresT");
			
			Game.scoresTmpl.link("#scoresBody",Game.position);
			
		}
		
		if (Game.robotsTmpl == null){
			
			Game.robotsTmpl = $.templates("#robotsT");
			
			Game.robotsTmpl.link("#robotsBody",Game.position);	
			
		}
		
		$(".player").hover(Control.overPlayer, Control.outPlayer);
		
		$(".robot").hover(Control.overRobot, Control.outRobot);
		
		//Game.history.push(Game.position);
		
		Game.posPlayers = [];
		
		$.each(Game.position.players, function(i,val){
			
			Game.posPlayers[val.name] = val;
			
		});
		
		Game.posStars = [];
		
		$.each(Game.position.crowds, function(i,val){
			
			Game.posStars[val.starId] = val;
			
		});
		
		Graph.adjustNodeSizes(Game.position.crowds);		
		
	},
	
	start: function(){
		
		if (Game.initialized)
		
			Game.interval = window.setInterval(Game.move, 3000);
		
	},
	
	stop: function(){
		
		if (Game.initialized)
		
			window.clearInterval(Game.interval);
		
	}
		
}

Config = {
		
	costMultiplier: 1,
	
	stayingBonus: 10,
	
	newStarScore: 20,
	
	startingNodeId: "n3",
	
	startingCredits: 1000,
	
	totRandomBots: 80,
	
	totRushBots: 20,
	
	getTotalPlayers: function(){
		
		return Config.totRandomBots + Config.totRushBots;
		
	}
		
}

Control = {
		
	playerTrc: null,
	
	overPlayer: function(event){
		
		Control.playerTrc = $(this).text();
		
		$(this).parent().css('background-color', 'LightBlue');
		
		Graph.s.graph.nodes(Game.posPlayers[Control.playerTrc].position).color = '#1E90FF';
		
		Graph.s.refresh({ skipIndexation: true });
		
	},
	
	outPlayer: function(event){
		
		$(this).parent().css('background-color', '');
		
		Graph.s.graph.nodes(Game.posPlayers[Control.playerTrc].position).color = Graph.defaultNodeColor;
		
		Graph.s.refresh({ skipIndexation: true });
		
	},
	
	overRobot: function(event){
		
		var robotType = $(this).text();
		
		$(this).parent().css('background-color', 'LightBlue');
		
		$.each(Graph.s.graph.nodes(),function(index,node){

			node.size = 10;
			
		});
		
		$.each(Game.position.crowds, function(i,crval){
			
			$.each(crval.playerGroups, function(i,pgval){
				
				if (pgval.playerType == robotType){
					
					Graph.s.graph.nodes(crval.starId).color = '#1E90FF';
					
					Graph.scaleNode(crval.starId, pgval.number, 4);
					
				}
				
			});
			
		});
		
		Graph.s.refresh({ skipIndexation: true });		
		
	},
	
	outRobot: function(event){
		
		$(this).parent().css('background-color', '');
		
		$.each(Graph.s.graph.nodes(),function(index,node){

			node.color = Graph.defaultNodeColor;
			
		});		
		
		Graph.adjustNodeSizes(Game.position.crowds);
		
	} 
	
}

NodeTip = {
		
	tip: null,
	
	init: function() {
		
		Opentip.styles.myErrorStyle = {
			  // Make it look like the alert style. If you omit this, it will default to "standard"
			  extends: "dark",
			  stem: true

		};
		
		NodeTip.tip = new Opentip("#tip", $("#tipPlaceholder").html(), { style: "myErrorStyle" });
		
	},
	
	over: function(e) {
		
		if (Game.position != null){
			
			var tipTemplate = $.templates("#nodeTipT");
			
			var starCrowds;
			
			$.each(Game.position.crowds, function(i,val){
				
				if (val.starId == e.data.node.id){
					
					starCrowds = val;
					
					return false;
					
				}
				
			});
			
			var tipHtml = tipTemplate.render(starCrowds);
			
			$("#tipPlaceholder").html(tipHtml);
			
		}
		
		NodeTip.tip.setContent($("#tipPlaceholder").html());
		
		NodeTip.tip.show();
		
	},
	
	out: function() {
		
		NodeTip.tip.hide();
		
	}	

}

Graph = {
		
	s: null,
	
	defaultNodeColor: 'WhiteSmoke',
	
	images: [		
		'img/ng.png',
		'img/nb.png',
		'img/no.png',
		'img/np.png',
		'img/nr.png'
	],
	
	init: function(data){
				
		var loaded = 0;
		
		Graph.images.forEach(function(url) {
			  sigma.canvas.nodes.image.cache(
			    url,
			    function() {
			      if (++loaded === Graph.images.length){
			        // Instantiate sigma:
			  		Graph.s = new sigma({ 
			            graph: data,
			            //container: 'r2v',
			            renderer: {
			                // IMPORTANT:
			                // This works only with the canvas renderer, so the
			                // renderer type set as "canvas" is necessary here.
			                container: document.getElementById('r2v'),
			                type: 'canvas'
			              },            
			            settings: {
			                defaultNodeColor: Graph.defaultNodeColor,
			                font: 'Ken',
			                hoverFont: 'Ken',
			                labelHoverBGColor: 'node',
			                edgeColor: 'default',
			                minNodeSize: 10,
			                maxNodeSize: 20             
			            }
			    	});
			  					    	
					Graph.s.startForceAtlas2();
					
					setTimeout(function(){ 
						Graph.s.killForceAtlas2();
					}, 2000);
					
					NodeTip.init();
					
					Graph.s.bind('overNode', function(e) {
						
						NodeTip.over(e);
						
					});
					
					Graph.s.bind('outNode', function(e) {
						
						NodeTip.out();
						
					});
					
			    	Game.init();
			  		
			      }
			    }
			  );
			});
		
	},
	
	freeze: function(){
		
		Graph.s.stopForceAtlas2();
		
	},
	
	exportMin: function(){
		
		var exportMin = "";
		$.each(Graph.s.graph.nodes(),function(index,node){
			var neighbors = Graph.s.graph.neighborhood(node.id);
			for (var i=0; i<neighbors.nodes.length; i++){
				exportMin += neighbors.nodes[i].id;
				if (i+1<neighbors.nodes.length)
					exportMin += ",";
			}
			exportMin += "-";
		});
		exportMin = exportMin.substring(0,exportMin.length-1);
		return exportMin;
		
	},
	
	scaleNode: function(nodeId, crowdSize, intensity){
		
		Graph.s.graph.nodes(nodeId).size = 10 + crowdSize * intensity;
		
	},
	
	adjustNodeSizes: function(crowds){
		
		$.each(crowds, function(i,val){
			
			Graph.scaleNode(val.starId, val.total, 1);
			
		});
		
		Graph.s.refresh({ skipIndexation: true });
		
	}

}

