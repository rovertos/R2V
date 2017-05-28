package transition;

import java.io.Serializable;

public class SingleMove implements Serializable {

	private static final long serialVersionUID = 1L;

	private String origin;
	
	private String destination;

	public String getOrigin() {
		return origin;
	}

	public void setOrigin(String origin) {
		this.origin = origin;
	}

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}
	
	@Override
	public boolean equals(Object otherMove) {
		
		if (otherMove instanceof SingleMove){
			
			return this.origin.equals(((SingleMove) otherMove).getOrigin()) && 
					
					this.destination.equals(((SingleMove) otherMove).getDestination());
			
		} else
			
			return false;
		
	}
	
}
