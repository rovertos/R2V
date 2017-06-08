Interface = {
		
	init: function(){
		
		$("#interface").accordion().draggable();
		
		var defaultGraph = "n0,n16,n6-n1,n4,n5,n18-n2,n14,n13-n3,n6,n7,n9-n4,n1,n8,n11,n21-n5,n1,n13,n7,n20-" +
							"n6,n3,n9,n0-n7,n3,n18,n5-n8,n4,n19,n12,n14-n9,n6,n3,n17-n10,n17,n20,n13-" +
							"n11,n4,n15-n12,n8,n21-n13,n5,n10,n2-n14,n2,n8,n21-n15,n11,n18-n16,n0,n20-n17,n10,n9,n19-"+
							"n18,n7,n15,n19,n1-n19,n8,n18,n17-n20,n10,n16,n5-n21,n12,n14,n4";
		
		$("#GraphString").val(defaultGraph);
		
		$(".spinner").spinner();
		
		$(".spinner").spinner({
			
		      spin: function( event, ui ) {
		    	  		    	  
		    	  if (ui.value < 0){
		    		  
		    		  $(this).spinner( "value", 0 );
		    		  
		    		  return false;
		    		  
		    	  }
		    	  
		      }
			
		});
		
		$("#StartingNode").selectmenu();
		
		$("#GenerateRndMap").click(function(){
			
			Graph.init(null);
			
			return false;
			
		});
		
		$("#LoadString").click(function(){
			
			Graph.init($("#GraphString").val());
			
			return false;
			
		});
		
		$("#StartGame").click(function(){
			
			Game.init();
						
			return false;
			
		});
		
		$(".ui-button").button();
		
		$("#StartGame").button("disable");
		    	
	},
	
	enableStartGame: function(){
		
		$("#StartingNode").selectmenu('destroy');
		
		$("#StartingNode").empty();
		
		var options = [];
		
		$.each(Graph.s.graph.nodes(), function(i,node){
			
			options.push("<option value='" + node.label + "'>" + node.id + "</option>");
			
		});
		
	    $('#StartingNode').append(options.join("")).selectmenu({ style: 'dropdown' });
	    
	    $('#StartingNode').val(Graph.s.graph.nodes()[0].id).selectmenu('refresh')
	    
	    $("#StartGame").button("enable");
		
	}
		
}