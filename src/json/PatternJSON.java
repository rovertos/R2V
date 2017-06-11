package json;

import java.io.Serializable;
import java.util.List;

import player.Player;

public class PatternJSON implements Serializable,  Comparable<PatternJSON> {

	private static final long serialVersionUID = 1L;

	private List<Integer> sequence;
	
	private int weight;

	public List<Integer> getSequence() {
		return sequence;
	}

	public void setSequence(List<Integer> sequence) {
		this.sequence = sequence;
	}

	public int getWeight() {
		return weight;
	}

	public void setWeight(int weight) {
		this.weight = weight;
	}
	
	public int compareTo(PatternJSON otherPattern) {
		
		return otherPattern.weight - this.weight;
		
	}
	
}
