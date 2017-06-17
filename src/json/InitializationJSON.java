package json;

import java.io.Serializable;
import java.util.List;

public class InitializationJSON implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private List<StarJSON> stars;
	
	private List<WormholeJSON> wormholes;
	
	private List<PatternJSON> patterns;
	
	private int chroma;

	public List<StarJSON> getStars() {
		
		return stars;
		
	}

	public void setStars(List<StarJSON> stars) {
		
		this.stars = stars;
		
	}

	public List<WormholeJSON> getWormholes() {
		
		return wormholes;
		
	}

	public void setWormholes(List<WormholeJSON> wormholes) {
		
		this.wormholes = wormholes;
		
	}

	public List<PatternJSON> getPatterns() {
		
		return patterns;
		
	}

	public void setPatterns(List<PatternJSON> patterns) {
		
		this.patterns = patterns;
		
	}

	public int getChroma() {
		
		return chroma;
		
	}

	public void setChroma(int chroma) {
		
		this.chroma = chroma;
		
	}	

}
