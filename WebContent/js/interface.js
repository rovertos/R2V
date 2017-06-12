Interface = {
		
	init: function(){
		
		$("#interface").accordion().draggable();
		
		var defaultGraph = "n0,n2,n3,n4,n5,n1-n1,n7,n8-n2,n6,n7-n3,n6,n10-n4,n9,n10-n5,n8,n9-n6,n11,n12,n19-n7,n12,n13,n17-"+
							"n8,n13,n14,n25-n9,n14,n15,n23-n10,n11,n15,n21-n11,n20-n12,n18-n13,n16-n14,n24-n15,n22-n16,n17,n25-"+
							"n17,n18-n18,n19-n19,n20-n20,n21-n21,n22-n22,n23-n23,n24-n24,n25-n25";
		
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
		
		$("#Chroma").selectmenu();
		
		$("#Bidirectional").selectmenu();
		
		$("#AnomalyNode").selectmenu();
		
		$("#AnomalyColor").selectmenu();
		
		$("#EdgeBoost").selectmenu();		
		
		$("#Sequence").spinner({
			  min: 2,
			  max: 6
		});
		
		$("#GenerateRndMap").click(function(){
			
			Graph.load(null);
			
			return false;
			
		});
		
		$("#EdgeBoost").on("selectmenuselect", function(event, ui) {
			
			Graph.edgeBoost = $(this).val();			
			
		});
		
		$("#LoadString").click(function(){
			
			Graph.load($("#GraphString").val());
			
			return false;
			
		});
		
		$("#StartGame").click(function(){
			
			Game.init();
						
			return false;
			
		});
		
		$("#ApplyAnomaly").click(function(){
			
			Game.tweakChroma($("#AnomalyNode").val(),$("#AnomalyColor").val());
						
			return false;
			
		});		
		
		$(".ui-button").button();
		
		$("#StartGame").button("disable");
		    	
	},
	
	enableStartGame: function(){
		
		$(".NodeList").each(function(){
			
			console.log($(this));
			
			$(this).selectmenu('destroy');
			
			$(this).empty();
			
			var options = [];
			
			$.each(Graph.s.graph.nodes(), function(i,node){
				
				options.push("<option value='" + node.label + "'>" + node.id + "</option>");
				
			});
			
			$(this).append(options.join("")).selectmenu({ style: 'dropdown' });
		    
			$(this).val(Graph.s.graph.nodes()[0].id).selectmenu('refresh');
			
		});
		
	    $("#StartGame").button("enable");
		
	}
		
}