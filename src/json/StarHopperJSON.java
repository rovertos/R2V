package json;

import java.io.Serializable;

public class StarHopperJSON implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private int credits;
	
	private int rank;
	
	private String location;

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

}
