
$(document).ready(function(){
	
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
	    	
	    	Game.init();
	    	
	    }
	});
	
});

Game = {
		
	interval: null,
	
	initialized: false,
	
	position: null,
	
	history: [],
	
	scoresTmpl: null,
	
	robotsTmpl: null,
	
	posPlayers: null,
	
	init: function(){
		
		var exportMin = Graph.exportMin();
		
		$.ajax({
		    type: "POST",  
		    url: "http://localhost:8080/R2V/init",
		    data: { min: exportMin, start: Config.startingNodeId, creds: Config.startingCredits, rnds: Config.totRandomBots, rush: Config.totRushBots},
		    dataType: "html",
		    success: function(data) {
		    	
		    	Game.initialized = true;
		    	
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
		
		Game.history.push(Game.position);
		
		Graph.adjustNodeSizes(Game.position.crowds);
		
		Game.posPlayers = [];
		
		$.each(Game.position.players, function(i,val){
			
			Game.posPlayers[val.name] = val;
			
		});
		
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
	
	totRushBots: 20		
		
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
	
	defaultNodeColor: '#ec5148',
	
	init: function(data){
		
		Graph.s = new sigma({ 
            graph: data,
            container: 'r2v',
            settings: {
                defaultNodeColor: Graph.defaultNodeColor,
                font: 'Ken',
                hoverFont: 'Ken',
                labelHoverBGColor: 'node',
                edgeColor: 'default'
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

