package json;

import java.io.Serializable;
import java.util.List;

public class StarHopperJSON implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private int credits;
	
	private int rank;
	
	private int score;	
	
	private String location;
	
	private List<String> visited;

	public int getCredits() {
		return credits;
	}

	public void setCredits(int credits) {
		this.credits = credits;
	}

	public int getRank() {
		return rank;
	}

	public void setRank(int rank) {
		this.rank = rank;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public List<String> getVisited() {
		return visited;
	}

	public void setVisited(List<String> visited) {
		this.visited = visited;
	}	

}
