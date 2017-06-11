package json;

import java.io.Serializable;
import java.util.List;

public class WormholeJSON implements Serializable, Comparable<WormholeJSON> {

	private static final long serialVersionUID = 1L;

	private String name;
	
	private double weight;
	
	private List<String> patterns;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getWeight() {
		return weight;
	}

	public void setWeight(double weight) {
		this.weight = weight;
	}

	public List<String> getPatterns() {
		return patterns;
	}

	public void setPatterns(List<String> patterns) {
		this.patterns = patterns;
	}
	
	public int compareTo(WormholeJSON otherWormhole) {
		
		if (otherWormhole.weight > this.weight)
			
			return 1;
		
		else if (otherWormhole.weight < this.weight)
			
			return -1;
		
		else
			
			return 0;
		
	}	
	
}
