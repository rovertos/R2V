package json;

import java.io.Serializable;
import java.util.List;

public class PositionJSON implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private List<CrowdJSON> crowds;
	
	private StarHopperJSON starHopper;
	
	private List<RankedPlayerJSON> players;
	
	private List<RobotsJSON> robots;

	public List<CrowdJSON> getCrowds() {
		return crowds;
	}

	public void setCrowds(List<CrowdJSON> crowds) {
		this.crowds = crowds;
	}

	public StarHopperJSON getStarHopper() {
		return starHopper;
	}

	public void setStarHopper(StarHopperJSON starHopper) {
		this.starHopper = starHopper;
	}

	public List<RankedPlayerJSON> getPlayers() {
		return players;
	}

	public void setPlayers(List<RankedPlayerJSON> players) {
		this.players = players;
	}

	public List<RobotsJSON> getRobots() {
		return robots;
	}

	public void setRobots(List<RobotsJSON> robots) {
		this.robots = robots;
	}	
	
}
