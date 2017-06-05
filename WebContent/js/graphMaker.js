Graph = {
	
	s: null,
	
	renderer: null,
	
	connections: [],
	
	consArray: [],
	
	g: { nodes: [], edges: [] },
	
	dragListener: null,
	
	defaultNodeColor: 'WhiteSmoke',
	
	images: [		
		'img/ng.png',
		'img/nb.png',
		'img/no.png',
		'img/np.png',
		'img/nr.png'
	],
	
	init: function(graphType){
		
		if (Graph.s){
		
			Graph.s.graph.clear();
			
			$("#r2v").empty();
			
			Graph.g = { nodes: [], edges: [] };
			
			Graph.connections= [];
			
			Graph.consArray = [];
		
		}
		
		var loaded = 0;
		
		Graph.images.forEach(function(url) {
			  sigma.canvas.nodes.image.cache(
			    url,
			    function() {
			      if (++loaded === Graph.images.length){
			        // Instantiate sigma:
			    	
			    	if (graphType == 0){
			    		
			    		$.ajax({
			    		    type: "GET",  
			    		    url: "http://localhost:8080/R2V/graph1.html",
			    		    async: false,
			    		    dataType: "json",
			    		    success: function(data) {
			    		    	
					    		Graph.generateDefault(data);
			    		    	
			    		    }
			    		});
			    		
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
					  console.log(event);
					});
					Graph.dragListener.bind('drop', function(event) {
					  console.log(event);
					});
					Graph.dragListener.bind('dragend', function(event) {
					  console.log(event);
					});					
					
					NodeTip.init();
					
					Graph.s.bind('overNode', function(e) {
						
						NodeTip.over(e);
						
					});
					
					Graph.s.bind('outNode', function(e) {
						
						NodeTip.out();
						
					});
										
					Interface.enableStartGame();
			  		
			      }
			    }
			  );
			});
		
	},
	
	generateDefault: function(data){
		
		console.log(data);
		
		Graph.s = new sigma({ 
	        graph: data,
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
	            maxNodeSize: 20             
	        }
		});
		
		console.log(Graph.s);
		
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
				    id: 'e' + edge++,
				    source: 'n' + i,
				    target: 'n' + r2vRndConsArray[j],
				    size: 10
				  });
				  Graph.consArray[r2vRndConsArray[j]]++;
				  Graph.connections[cs++] = i + '-' + r2vRndConsArray[j];
				  Graph.connections[cs++] = r2vRndConsArray[j] + '-' + i;
		    }
		}
				
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
	            maxNodeSize: 20   
	        }
		});		
		
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