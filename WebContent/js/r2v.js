
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
		
	init: function(){
		
		var exportMin = Graph.exportMin();
		
		$.ajax({
		    type: "POST",  
		    url: "http://localhost:8080/R2V/init",
		    data: { min: exportMin, start: Config.startingNodeId, creds: Config.startingCredits, rnds: Config.totRandomBots},
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
			
		}
		
		if (Game.scoresTmpl == null){
			
			Game.scoresTmpl = $.templates("#scoresT");
			
			Game.scoresTmpl.link("#scoresBody",Game.position);
			
		}
		
		Game.history.push(Game.position);
		
		Game.adjustNodeSizes(Game.position.crowds);
		
	},
	
	start: function(){
		
		if (Game.initialized)
		
			Game.interval = window.setInterval(Game.move, 3000);
		
	},
	
	stop: function(){
		
		if (Game.initialized)
		
			window.clearInterval(Game.interval);
		
	},
	
	adjustNodeSizes: function(crowds){
		
		$.each(crowds, function(i,val){
			
			Graph.scaleNode(val.starId, val.total);
			
		});
		
		Graph.s.refresh({ skipIndexation: true });
		
	}
		
}

Config = {
		
	costMultiplier: 1,
	
	stayingBonus: 0,
	
	newStarScore: 20,
	
	startingNodeId: "n3",
	
	startingCredits: 1000,
	
	totRandomBots: 100		
		
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
				
				console.log(val);
				
				Graph.scaleNode(val.starId, val.total);
				
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
	
	init: function(data){
		
		Graph.s = new sigma({ 
            graph: data,
            container: 'r2v',
            settings: {
                defaultNodeColor: '#ec5148',
                font: 'Ken',
                hoverFont: 'Ken',
                labelHoverBGColor: 'node'
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
	
	scaleNode: function(nodeId, crowdSize){
		
		Graph.s.graph.nodes(nodeId).size = 10 + crowdSize;
		
	}

}

