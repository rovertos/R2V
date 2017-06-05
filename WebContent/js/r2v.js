
$(document).ready(function(){
	
	Interface.init();
	
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
	      
	      if (Game.posStars[node.id]){
	    	  
		      var star = Game.posStars[node.id];
		      
		      percentageVisited = star.visited / Game.position.players.length;
	    	  
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
		
		Game.move();
		
	});
	
	$("#sbut2").click(function() {
		
		Game.startAuto();
		
	});
	
	$("#sbut3").click(function() {
		
		Game.stopAuto();
		
	});		
	
	$("#sbut4").click(function() {
		
		Graph.s.startForceAtlas2({worker: true, barnesHutOptimize: false});
				
	});
	
	$("#sbut5").click(function() {
		
		Graph.s.killForceAtlas2();
		
	});	
	
	$("#sbut6").click(function() {
		
		Game.stopAuto();
		
	});
	
});

Game = {
		
	interval: null,
	
	initialized: false,
	
	position: null,
	
	scoresTmpl: null,
	
	robotsTmpl: null,
	
	posPlayers: [],
	
	posStars: [],
	
	init: function(){
		
		var exportMin = Graph.exportMin();
		
		var startingNodeId = $("#StartingNode").val();
		
		var startingCredits = $("#StartingCredits").val();
		
		var totRandomBots = $("#RandomBots").val();
		
		var totRushBots = $("#RushBots").val();
		
		$.ajax({
		    type: "POST",  
		    url: "http://localhost:8080/R2V/init",
		    data: { min: exportMin, start: startingNodeId, creds: startingCredits, rnds: totRandomBots, rush: totRushBots},
		    dataType: "json",
		    success: function(data) {
		    	
		    	Game.initialized = true;
		    	
				$.each(data.stars, function(i,star){
					
					Graph.s.graph.nodes(star.name).type = 'image';
					
					Graph.s.graph.nodes(star.name).url = Graph.images[star.colorIndex];
					
				});
				
				Game.move();
		    	
		    }
		});
		
	},
	
	move: function(){
		
		var costMultiplier = $("#CostMultiplier").val();
		
		var stayingBonus = $("#StayingBonus").val();
		
		var newStarScore = $("#NewStarScore").val();
		
		$.ajax({
		    type: "POST",  
		    url: "http://localhost:8080/R2V/ctrl",
		    data: { cmult: costMultiplier, stbon: stayingBonus, newsc: newStarScore },
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
	
	startAuto: function(){
		
		if (Game.initialized)
		
			Game.interval = window.setInterval(Game.move, 3000);
		
	},
	
	stopAuto: function(){
		
		if (Game.initialized)
		
			window.clearInterval(Game.interval);
		
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