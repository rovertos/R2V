

Chroma = {

	max: 3,
		
	table: [[0,0,0,-1],[0,0,-1,-1],[0,0,-1,-1]],
	
	foundEdges: [],
	
	init: function(){
		
		for (var i=0; i<Chroma.table.length; i++){
			
			for (var j=0; j<Chroma.table[i].length; j++){
				
				var id = i + "_" + j;
				
				if (Chroma.table[i][j] > -1){
					
					$("#" + id).addClass("c" + Chroma.table[i][j]);
					
				} else {
					
					$("#" + id).addClass("void");
					
				}
				
			}
			
		}
		
		$(".chroma").mouseover(Chroma.over);
		
		$(".chroma").mouseout(Chroma.out);
		
		$(".chroma").click(Chroma.click);
		
	},
	
	findPath: function(nodeId,remainingPattern,edgesWalked){
				
		var color = Graph.images.indexOf(Graph.s.graph.nodes(nodeId).url);
		
		var neighbors = Graph.s.graph.neighborhood(nodeId);
		
		if (remainingPattern.length > 1){
			
			for (var i=0; i<neighbors.nodes.length; i++){
				
				if (neighbors.nodes[i].id != nodeId){
				
					var edgeName = Game.getWormhole(nodeId, neighbors.nodes[i].id).name;
					
					if (edgesWalked.indexOf(edgeName) < 0){
					
						var neighborColor = Graph.images.indexOf(Graph.s.graph.nodes(neighbors.nodes[i].id).url);
						
						if (remainingPattern[0] == color && remainingPattern[1] == neighborColor){
							
							var edgeName = Game.getWormhole(nodeId, neighbors.nodes[i].id).name;
							
							var newEdgesWalked = edgesWalked.slice(0);
							
							newEdgesWalked.push(edgeName);
							
							var newRemainingPattern = remainingPattern.slice(1,remainingPattern.length);
							
							Chroma.findPath(neighbors.nodes[i].id, newRemainingPattern, newEdgesWalked);
							
						}
						
					}
				
				}
				
			}
			
		} else {
			
			if (remainingPattern.length == 1){
				
				for (var i=0; i<edgesWalked.length; i++){
					
					Chroma.foundEdges.push(edgesWalked[i]);
					
				}
				
			}
			
			for (var i=0; i<neighbors.nodes.length; i++){
				
				if (neighbors.nodes[i].id != nodeId){
				
					for (var row=0; row < Chroma.table.length; row++){
						
						var neighborColor = Graph.images.indexOf(Graph.s.graph.nodes(neighbors.nodes[i].id).url);
						
						var pattern = Chroma.getPattern(row);
						
						var newRemainingPattern = null;
						
						if (pattern[0] == color && pattern[1] == neighborColor){
							
							newRemainingPattern = pattern.slice(1,pattern.length);												
							
						} else if (pattern[pattern.length-1] == color && pattern[pattern.length-2] == neighborColor){
							
							newRemainingPattern = pattern.reverse().slice(1,pattern.length);
							
						}
						
						if (newRemainingPattern){
													
							var edgeName = Game.getWormhole(nodeId, neighbors.nodes[i].id).name;
							
							if (Chroma.foundEdges.indexOf(edgeName) < 0){
								
								var newEdgesWalked = [];
									
								newEdgesWalked.push(edgeName);
									
								Chroma.findPath(neighbors.nodes[i].id, newRemainingPattern, newEdgesWalked);
							
							}
							
						}
						
					}
					
				}
				
			}
			
		}
		
	},
	
	findEdges: function(){
		
		var pActive = Chroma.getPattern(0).join(",");
		
		var wormholeNameArray = Object.keys(Game.wormholes);
		
		for (var i=0; i<wormholeNameArray.length; i++){
			
			var wormhole = Game.wormholes[wormholeNameArray[i]];
			
			for (var j=0; j<wormhole.patterns.length; j++){
				
				var pattern = wormhole.patterns[j];
				
				var reverse = pattern.split(",").reverse().join(",");
				
				if (pActive == pattern || pActive == reverse){
					
					Chroma.foundEdges.push(wormhole.name);
					
					break;
					
				}
				
			};
			
		};
		
	},
	
	getPattern: function(row){
		
		var pattern = [];
		
		for (var i=0; i<Chroma.table[row].length; i++){
			
			if (Chroma.table[row][i] > -1)
				
				pattern.push(Chroma.table[row][i]);
			
		}
		
		return pattern;
		
	},
	
	click: function(){
		
		if (!$(this).hasClass('void')){
		
			var xy = $(this).attr('id').split("_");
			
			$(this).removeClass('h' + Chroma.table[xy[0]][xy[1]]);
			
			if (Chroma.table[xy[0]][xy[1]] < Chroma.max - 1){
				
				Chroma.table[xy[0]][xy[1]] += 1;
				
			} else {
				
				Chroma.table[xy[0]][xy[1]] = 0;
				
			}
			
			$(this).addClass('h' + Chroma.table[xy[0]][xy[1]]);
						
			Chroma.foundEdges = [];
			
			Chroma.findPath(Game.posPlayers["you"].location, [], []);
			
			//TODO: Implement button
			Graph.s.refresh({ skipIndexation: true });
		
		}				
		
	},
		
	over: function(){
		
		if (!$(this).hasClass('void')){
			
			var xy = $(this).attr('id').split("_");
			
			var c = Chroma.table[xy[0]][xy[1]];
			
			$(this).removeClass('c' + c).addClass('h' + c);
			
		}
		
	},
	
	out: function(){
		
		if (!$(this).hasClass('void')){
			
			var xy = $(this).attr('id').split("_");
			
			var c = Chroma.table[xy[0]][xy[1]];
			
			$(this).removeClass('h' + c).addClass('c' + c);
			
		}
		
	},	
		
}

