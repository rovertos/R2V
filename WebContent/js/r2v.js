
$(document).ready(function(){
	
	Interface.init();
	
	sigma.utils.pkg('sigma.canvas.nodes');
	
	sigma.utils.pkg('sigma.canvas.edges');
	
	sigma.canvas.edges.r2v = function(edge, source, target, context, settings) {
	  var color = edge.color,
	      prefix = settings('prefix') || '',
	      edgeColor = settings('edgeColor'),
	      defaultNodeColor = settings('defaultNodeColor'),
	      defaultEdgeColor = settings('defaultEdgeColor');

	  if (!color)
		    switch (edgeColor) {
		      case 'source':
		        color = source.color || defaultNodeColor;
		        break;
		      case 'target':
		        color = target.color || defaultNodeColor;
		        break;
		      default:
		        color = defaultEdgeColor;
		        break;
		    }	  
	  
	  var weight;
	  
	  if (Game.wormholes[source.id + "_" + target.id]){
		  
		  weight = (Game.wormholes[source.id + "_" + target.id].weight - 1)*10+1;
		  
	  } else if (Game.wormholes[target.id + "_" + source.id]){
		  
		  weight = (Game.wormholes[target.id + "_" + source.id].weight - 1)*10+1;
		  
	  } else {
		  
		  weight = 1;
		  
	  }
	  	  
	  context.strokeStyle = color;
	  context.lineWidth = weight;
	  context.beginPath();
	  context.moveTo(
	    source[prefix + 'x'],
	    source[prefix + 'y']
	  );
	  context.lineTo(
	    target[prefix + 'x'],
	    target[prefix + 'y']
	  );
	  context.stroke();
	};
	
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
	      if (Game.posPlayers["you"] && node.id == Game.posPlayers["you"].location && Game.playerTrapped){	    	  
	    	  context.strokeStyle = 'red';	    	  
	      } else {
	    	  context.strokeStyle = node.color || settings('defaultNodeColor');
	      }
	      context.stroke();
	      
	      // Player position
	      if (Game.posPlayers["you"] && node.id == Game.posPlayers["you"].location){
	    	  
		      context.beginPath();
		      context.arc(
		        node[prefix + 'x'],
		        node[prefix + 'y'],
		        node[prefix + 'size'] + size,
		        0,
		        Math.PI * 2,
		        false
		      );
		      context.lineWidth = 1;
		      context.strokeStyle = "white";
		      context.stroke();	    	  
	      }
	      
	      if (Game.posPlayers["you"] && Game.posPlayers["you"].visited.indexOf(node.id) > -1){
	    	  
		      context.beginPath();
		      context.arc(
		        node[prefix + 'x'],
		        node[prefix + 'y'],
		        node[prefix + 'size'] + size*3/5,
		        0,
		        Math.PI * 2,
		        false
		      );
		      context.lineWidth = 1;
		      context.strokeStyle = "grey";
		      context.stroke();		    	  
	    	  
	      }
	      
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
		
		alert(Graph.exportMin());
		
	});
	
	Designer.init();
	
});

Game = {
		
	interval: null,
	
	initialized: false,
	
	position: null,
	
	scoresTmpl: null,
	
	robotsTmpl: null,
	
	playerRankTmpl: null,
	
	playerScoreTmpl: null,
	
	posPlayers: [],
	
	posStars: [],
	
	patterns: [],
	
	wormholes: [],
	
	playerTrapped: false,
	
	init: function(){
		
		if (Designer.active){
			
			Designer.destroy();
			
		}
		
		var exportMin = Graph.exportMin();
		
		var startingNodeId = $("#StartingNode").val();
		
		var startingCredits = $("#StartingCredits").val();
		
		var totRandomBots = $("#RandomBots").val();
		
		var totRushBots = $("#RushBots").val();
		
		var chroma = $("#Chroma").val();
		
		var sequence = $("#Sequence").val();
		
		var bidirectional = $("#Bidirectional").val();
		
		Game.patterns = [];
		
		Game.wormholes = [];
				
		$.ajax({
		    type: "POST",  
		    url: "http://localhost:8080/R2V/init",
		    data: { min: exportMin, start: startingNodeId, creds: startingCredits, rnds: totRandomBots, rush: totRushBots, chrm: chroma, exseq: sequence, exbid: bidirectional},
		    dataType: "json",
		    success: function(data) {
		    	
		    	Game.initialized = true;
		    	
				$.each(data.stars, function(i,star){
					
					Graph.s.graph.nodes(star.name).type = 'image';
					
					Graph.s.graph.nodes(star.name).url = Graph.images[star.colorIndex];
					
				});
				
				$.each(data.patterns, function(i,pattern){
					
					Game.patterns[pattern.sequence.join(",")] = pattern;
					
				});
				
				$.each(data.wormholes, function(i,wormhole){
					
					Game.wormholes[wormhole.name] = wormhole;
					
				});				
				
				Game.move();
				
				Graph.s.refresh({ skipIndexation: true });
		    	
		    }
		});
		
	},
	
	tweakChroma: function(anomalyNode,color){
		
		$.ajax({
		    type: "POST",  
		    url: "http://localhost:8080/R2V/tweak",
		    data: { anomaly: anomalyNode, color: color },
		    dataType: "json",
		    success: function(data) {
		    	
				Game.patterns = [];
				
				Game.wormholes = [];
				
				console.log(data);
		    	
				$.each(data.stars, function(i,star){
					
					Graph.s.graph.nodes(star.name).type = 'image';
					
					Graph.s.graph.nodes(star.name).url = Graph.images[star.colorIndex];
					
				});
				
				$.each(data.patterns, function(i,pattern){
					
					Game.patterns[pattern.sequence.join(",")] = pattern;
					
				});
				
				$.each(data.wormholes, function(i,wormhole){
					
					Game.wormholes[wormhole.name] = wormhole;
					
				});				
								
				Graph.s.refresh({ skipIndexation: true });
		    	
		    }
		});		
		
	},
	
	move: function(){
		
		var playerStaying = Game.posPlayers["you"] ? Game.posPlayers["you"].location : $("#StartingNode").val();
		
		Game.starHopperMove(playerStaying,0);
		
	},
	
	starHopperMove: function(starhopperMove, starhopperBid){
		
		var costMultiplier = $("#CostMultiplier").val();
		
		var stayingBonus = $("#StayingBonus").val();
		
		var newStarScore = $("#NewStarScore").val();
		
		var backTrackPenalty = $("#BackTrackPenalty").val();
		
		var args = { cmult: costMultiplier, stbon: stayingBonus, newsc: newStarScore, shmov: starhopperMove, shbid: starhopperBid, btpen: backTrackPenalty};
				
		$.ajax({
		    type: "POST",  
		    url: "http://localhost:8080/R2V/ctrl",
		    data: args,
		    dataType: "json",
		    success: function(data) {
		    	
		    	if (data.winner){
		    		
		    		Game.endGame(data.winner);

		    	}		    		
		    	
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
			
			$.observable(Game.position).setProperty("starHopper",data.starHopper);
			
		}
		
		if (Game.scoresTmpl == null){
			
			Game.scoresTmpl = $.templates("#scoresT");
			
			Game.scoresTmpl.link("#scoresBody",Game.position);
			
		}
		
		if (Game.robotsTmpl == null){
			
			Game.robotsTmpl = $.templates("#robotsT");
			
			Game.robotsTmpl.link("#robotsBody",Game.position);
			
		}
		
		if (Game.playerRankTmpl == null){
			
			Game.playerRankTmpl = $.templates("#playerRankT");
			
			Game.playerRankTmpl.link("#playerRank",Game.position);
			
		}
		
		if (Game.playerScoreTmpl == null){
			
			Game.playerScoreTmpl = $.templates("#playerScoreT");
			
			Game.playerScoreTmpl.link("#playerScore",Game.position);
			
		}
		
		$(".player").hover(Control.overPlayer, Control.outPlayer);
		
		$(".robot").hover(Control.overRobot, Control.outRobot);
		
		Game.posPlayers = [];
		
		$.each(Game.position.players, function(i,val){
			
			Game.posPlayers[val.name] = val;
			
		});
		
		Game.posPlayers["you"] = data.starHopper;
		
		Game.posStars = [];
		
		$.each(Game.position.crowds, function(i,val){
			
			Game.posStars[val.starId] = val;
			
		});
		
		if (data.starHopper.credits <= Game.posStars[data.starHopper.location].total * $("#CostMultiplier").val()){
			
			if (!Game.playerTrapped)
				
				Game.startAuto();
			
			Game.playerTrapped = true;
			
		} else {
			
			Game.playerTrapped = false;
			
			Game.stopAuto();
			
		}
		
		Graph.adjustNodeSizes(Game.position.crowds);		
		
	},
	
	startAuto: function(){
		
		if (Game.initialized)
		
			Game.interval = window.setInterval(Game.move, 1000);
		
	},
	
	stopAuto: function(){
		
		if (Game.initialized)
		
			window.clearInterval(Game.interval);
		
	},
	
	endGame: function(winner){
		
		Game.stopAuto();
		
		if (winner === "YOU"){
			
			NodeTip.victory.show();
			
		} else {
			
			$("#Winner").text(winner);
			
			NodeTip.defeat = new Opentip("#GameOver", $("#Defeat").html(), "Game Over", { style: "defeatStyle" });	
			
			NodeTip.defeat.show();
			
		}		
		
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
	
	victory: null,
	
	defeat: null,
	
	dragging: false,
	
	init: function() {
		
		Opentip.styles.myErrorStyle = {
			  // Make it look like the alert style. If you omit this, it will default to "standard"
			  extends: "dark",
			  stem: true

		};
		
		NodeTip.tip = new Opentip("#tip", $("#tipPlaceholder").html(), { style: "myErrorStyle" });
		
		Opentip.styles.victoryStyle = {
				  // Make it look like the alert style. If you omit this, it will default to "standard"
				  extends: "glass",
				  stem: false,
				  hideTrigger: "closeButton"

			};
			
		NodeTip.victory = new Opentip("#GameOver", $("#Victory").html(), "Game Over", { style: "victoryStyle" });
		
		Opentip.styles.defeatStyle = {
				  // Make it look like the alert style. If you omit this, it will default to "standard"
				  extends: "alert",
				  stem: false,
				  hideTrigger: "closeButton"

			};	
		
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
			
			NodeTip.tip.setContent($("#tipPlaceholder").html());
			
			NodeTip.tip.show();			
			
		}
		
	},
	
	out: function() {
		
		NodeTip.tip.hide();
		
	},
	
	click: function(e){
		
		if (!NodeTip.dragging && !Game.playerTrapped){
		
			var neighbors = Graph.s.graph.neighborhood(Game.posPlayers["you"].location);
			
			for (var i=0; i<neighbors.nodes.length; i++){
				
				if (e.data.node.id == neighbors.nodes[i].id){
				
					Game.starHopperMove(e.data.node.id, 0);
					
					break;
					
				}
				
			}			
			
		}
		
		NodeTip.dragging = false;
		
	}

}