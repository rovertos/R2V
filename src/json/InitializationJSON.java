package json;

import java.io.Serializable;
import java.util.List;

public class InitializationJSON implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private List<StarJSON> stars;

	public List<StarJSON> getStars() {
		
		return stars;
		
	}

	public void setStars(List<StarJSON> stars) {
		
		this.stars = stars;
		
	}	

}
