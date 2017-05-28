package board;

import org.jgrapht.graph.DefaultEdge;

public class Wormhole extends DefaultEdge {

	private static final long serialVersionUID = 1L;
	
	public Star getSource(){
		
		return (Star)super.getSource();
		
	}
	
	public Star getTarget(){
		
		return (Star)super.getTarget();
		
	}
	
	public Star getExitPoint(Star entryPoint){
		
		if (entryPoint.getName().equals(getSource().getName()))
			
			return getTarget();
		
		else
			
			return getSource();
		
	}
	
}
