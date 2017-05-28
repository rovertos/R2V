package json;

import java.io.Serializable;

public class RankedPlayerJSON implements Serializable {

	private static final long serialVersionUID = 1L;

	private String name;
	
	private int score;
	
	private int credits;
	
	private String visited;	
	
	private String position;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public int getCredits() {
		return credits;
	}

	public void setCredits(int credits) {
		this.credits = credits;
	}

	public String getVisited() {
		return visited;
	}

	public void setVisited(String visited) {
		this.visited = visited;
	}	
	
}
