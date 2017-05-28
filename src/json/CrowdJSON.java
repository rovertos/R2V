package json;

import java.io.Serializable;
import java.util.List;

public class CrowdJSON implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String starId;
	
	private List<PlayerGroupJSON> playerGroups;
	
	private int total;

	public String getStarId() {
		return starId;
	}

	public void setStarId(String starId) {
		this.starId = starId;
	}

	public List<PlayerGroupJSON> getPlayerGroups() {
		return playerGroups;
	}

	public void setPlayerGroups(List<PlayerGroupJSON> playerGroups) {
		this.playerGroups = playerGroups;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}	
	
}
