Interface = {
		
	init: function(){
		
		$("#interface").accordion().draggable();
		
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
			
			Graph.init(1);
			
			return false;
			
		});
		
		$("#GenerateDefault").click(function(){
			
			Graph.init(0);
			
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