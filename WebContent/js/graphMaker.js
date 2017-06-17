Graph = {
	
	s: null,
	
	renderer: null,
	
	connections: [],
	
	consArray: [],
	
	g: { nodes: [], edges: [] },
	
	dragListener: null,
	
	defaultNodeColor: 'WhiteSmoke',
	
	edgeBoost: 0,
	
	images: [
		'img/ng.png',
		'img/nb.png',
		'img/no.png',
		'img/np.png',
		'img/nr.png'
	],
	
	load: function(graphStr){
				
		Graph.clearGraph();
		
		var loaded = 0;
		
		Graph.images.forEach(function(url) {
			  sigma.canvas.nodes.image.cache(
			    url,
			    function() {
			      if (++loaded === Graph.images.length){
			        // Instantiate sigma:
			    	
			    	if (graphStr && graphStr.indexOf("-") > 0 && graphStr.indexOf(",") > 0){
			    		
			    		Graph.loadFromString(graphStr);
			    		
			    	} else {
			    		
			    		Graph.generateRnd();
			    		
			    	}
			  					    	
			    	Graph.s.startForceAtlas2({worker: true, barnesHutOptimize: false});
					
					setTimeout(function(){
						Graph.s.killForceAtlas2();
					}, 1000);
					
					Graph.dragListener = sigma.plugins.dragNodes(Graph.s, Graph.s.renderers[0]);
					
					Graph.dragListener.bind('startdrag', function(event) {
					  Graph.s.killForceAtlas2();
					});
					Graph.dragListener.bind('drag', function(event) {
						NodeTip.dragging = true;
					});
					Graph.dragListener.bind('drop', function(event) {
						//console.log("drop");
					});
					Graph.dragListener.bind('dragend', function(event) {
					  //console.log(event);
					});					
					
					NodeTip.init();
					
					Graph.s.bind('overNode', function(e) {
						
						NodeTip.over(e);
						
					});
					
					Graph.s.bind('outNode', function(e) {
						
						NodeTip.out();
						
					});
					
					Graph.s.bind('clickNode', function(e) {
						
						NodeTip.click(e);
						
					});					
										
					Interface.enableStartGame();
			  		
			      }
			    }
			  );
			});
		
	},
	
	clearGraph: function(){
		
		if (Graph.s){
			
			Graph.s.graph.clear();
			
			$("#r2v").empty();
			
			Graph.g = { nodes: [], edges: [] };
			
			Graph.connections= [];
			
			Graph.consArray = [];
			
			Game.patterns = [];
			
			Game.wormholes = [];
		
		}
		
		if (Designer.active){
			
			Designer.destroy();
			
		}
		
	},
	
	loadFromString: function(graphStr){
		
		var adjacencies = graphStr.trim().split("-");
		
		var r = 0;
		
		var e = 0;
		
		// Create nodes
		
		for (var i=0; i<adjacencies.length; i++){
			
			var node = adjacencies[i].indexOf(",") > -1 ? adjacencies[i].substr(0,adjacencies[i].indexOf(",")) : adjacencies[i];
			
			 Graph.g.nodes.push({
			    id: node,
			    label: node,
			    x: r++,
			    y: r++,
			    size: 10
			});
			
		}
		
		// Create edges
		
		for (var i=0; i<adjacencies.length; i++){
			
			var nodes = adjacencies[i].split(",");
			
			for (var j=1; j<nodes.length; j++){
				
				Graph.g.edges.push({
					id: nodes[0] + "_" + nodes[j],
					source: nodes[0],
					target: nodes[j],
					size: 10,
					type: 'r2v'
				});
				
			}
		
		}
						
		Graph.newSigma();
		
	},
	
	generateRnd: function(){
				
		var i,
			r = 1,
		    s,
		    N = $("#NumberOfStars").val(),
		    edge = 0;
		
		// Generate a random graph:
		for (i = 0; i < N; i++)
		  Graph.g.nodes.push({
		    id: 'n' + i,
		    label: 'n' + i,
		    x: r++,
		    y: r++,
		    size: 10
		  });
				
		for (var k=0; k<N; k++){
			Graph.consArray[k]=0;
		}
		
		var cs = 0;
		
		for (i = 0; i < N; i++){
		    var cons = 1 + (Math.random() * 2 | 0);
		    var r2vRndConsArray = Graph.r2vRndCons(cons, i);
		    for (var j = 0; j < cons; j++){
				   Graph.g.edges.push({
				    id: 'n' + i + "_" + 'n' + r2vRndConsArray[j],
				    source: 'n' + i,
				    target: 'n' + r2vRndConsArray[j],
				    size: 10,
					type: 'r2v'
				  });
				  Graph.consArray[r2vRndConsArray[j]]++;
				  Graph.connections[cs++] = i + '-' + r2vRndConsArray[j];
				  Graph.connections[cs++] = r2vRndConsArray[j] + '-' + i;
		    }
		}
				
		Graph.newSigma();	
		
	},
	
	newSigma: function(){
		
		Graph.s = new sigma({
		  	graph: Graph.g,
	        renderer: {
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
	            maxNodeSize: 20,
	            doubleClickEnabled: false
	        }
		});		
		
	},
	
	exportMin: function(){
		
		if (Designer.active){			
			Graph.s.graph.dropNode("en1");
			Graph.s.graph.dropNode("en2");
			Graph.s.graph.dropNode("en3");
			Graph.s.graph.dropNode("en4");		
		}
		
		var exportMin = "";
		
		var alreadyJoined = [];
		
		$.each(Graph.s.graph.nodes(),function(index,node){
			
			var neighbors = Graph.s.graph.neighborhood(node.id);
			
			exportMin += node.id;
			
			for (var i=1; i<neighbors.nodes.length; i++){
				
				if (alreadyJoined.indexOf(neighbors.nodes[i].id + "_" + node.id) < 0){
				
					exportMin += "," + neighbors.nodes[i].id;
					
					alreadyJoined.push(node.id + "_" + neighbors.nodes[i].id);
				
				}
				
			}
			
			exportMin += "-";
			
		});
		
		exportMin = exportMin.substring(0,exportMin.length-1);
		
		console.log(exportMin);
		
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
		
	},
	
	r2vRndCons: function(arrayLength, origin){
		var arr = []
		while(arr.length < arrayLength){
	    var randomnumber = Graph.rndWeakestLink(arr, origin);
	    if(arr.indexOf(randomnumber) > -1) continue;
	    arr[arr.length] = randomnumber;
	  }
	  return arr;
	},
	
	rndWeakestLink: function(excludeArray, origin){
		var weakest = 999;
		for (var i=0; i<Graph.consArray.length; i++){
			if (Graph.consArray[i] < weakest && i != origin && excludeArray.indexOf(i) < 0 && !Graph.alreadyConnected(origin,i))
				weakest = Graph.consArray[i];
		}
		var weakestIndexArray = [];
		var wi = 0;
		for (i=0; i<Graph.consArray.length; i++){
			if (Graph.consArray[i] == weakest && i != origin && excludeArray.indexOf(i) < 0 && !Graph.alreadyConnected(origin,i)){
				weakestIndexArray[wi]=i;
				wi++;
			}
		}
		var rnd = (Math.random() * wi | 0);
		return weakestIndexArray[rnd];
	},
	
	alreadyConnected: function(origin, destination){
		var key1 = origin + '-' + destination;	
		var key2 = destination + '-' + origin;
		return (Graph.connections.indexOf(key1) > -1 || Graph.connections.indexOf(key2) > -1);	
	}
	
}

Designer = {
		
	active: true,
	
	dom: null,
	
	n: 0,
	
	nodeClicked: null,
	
	init: function(){
		
		Designer.active = true;
		
		Graph.newSigma();
		
		Designer.dom = document.querySelector('#r2v canvas:last-child');
		
		var h = $("#r2v").height();
		
		var w = $("#r2v").width();
		
		Graph.s.graph.addNode({
			id: 'en1',
			label: 'en1',
			x: -w/2,
			y: -h/2,
			color: 'grey',
			size: 10
		});
		
		Graph.s.graph.addNode({
			id: 'en2',
			label: 'en2',
			x: w/2,
			y: h/2,
			color: 'grey',			
			size: 10
		});
		
		Graph.s.graph.addNode({
			id: 'en3',
			label: 'en3',
			x: -w/2,
			y: h/2,
			color: 'grey',			
			size: 10
		});
		
		Graph.s.graph.addNode({
			id: 'en4',
			label: 'en4',
			x: w/2,
			y: -h/2,
			color: 'grey',			
			size: 10
		});		
		
		Designer.dom.addEventListener('dblclick', Designer.addNode);
		
		Graph.s.bind('clickNode', Designer.clickNode);
		
	},
	
	clickNode: function(e){
		
		if (Designer.nodeClicked && (e.data.node.id == Designer.nodeClicked)){
			
			Graph.s.graph.dropNode(e.data.node.id);
			
			Designer.nodeClicked = null;
			
			Graph.s.refresh();
			
		} else if (Designer.nodeClicked){
			
		   Graph.s.graph.addEdge({
			   
			    id: Designer.nodeClicked + "_" + e.data.node.id,
			    
			    source: Designer.nodeClicked,
			    
			    target: e.data.node.id,
			    
			    size: 10,
			    
				type: 'r2v'

			  });
			
			Graph.s.graph.nodes(Designer.nodeClicked).color = Graph.defaultNodeColor;
			
			Graph.s.refresh({ skipIndexation: true });
			
			Designer.nodeClicked = null;
			
		} else {
			
			Designer.nodeClicked = e.data.node.id;
			
			e.data.node.color = 'red';
			
			Graph.s.refresh({ skipIndexation: true });			
			
		}
		
	},
	
	addNode: function(e){
		
	    var x,
        	y,
        	p

	    x = sigma.utils.getX(e) - Designer.dom.offsetWidth / 2;
	    y = sigma.utils.getY(e) - Designer.dom.offsetHeight / 2;

	    p = Graph.s.camera.cameraPosition(x, y);
	    x = p.x;
	    y = p.y;
	    
		Graph.s.graph.addNode({
			id: 'n' + Designer.n,
			label: 'n' + Designer.n,
			x: x,
			y: y,
			size: 1
		});
		
		Designer.n++;
		
		Graph.s.refresh();
	    
	},
	
	destroy: function(){
		
		Designer.dom.removeEventListener("click", Designer.addNode);
				
		Designer.active = false;
		
	}
		
}