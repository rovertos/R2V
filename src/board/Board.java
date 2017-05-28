package board;

import java.util.HashMap;
import java.util.List;

import player.Robot;
import player.StarHopper;

public class Board {

	private Constellation constellation;
	
	private List<Robot> robots;
	
	private StarHopper starHopper;
	
	private HashMap<String,Star> starMap = new HashMap<String,Star>();
	
	private Star startingStar;
	
	public int TURN = 0;

	public Star getStar(String nodeId){
		
		return starMap.get(nodeId);
		
	}
	
	public void addStar(String nodeId, Star star){
		
		if (!starMap.containsKey(nodeId))
			
			this.starMap.put(nodeId, star);
		
	}
	
	public Star getStartingStar() {
		return startingStar;
	}

	public void setStartingStar(Star startingStar) {
		this.startingStar = startingStar;
	}

	public Constellation getConstellation() {
		return constellation;
	}

	public void setConstellation(Constellation constellation) {
		this.constellation = constellation;
	}

	public List<Robot> getRobots() {
		return robots;
	}

	public void setRobots(List<Robot> robots) {
		this.robots = robots;
	}

	public StarHopper getStarHopper() {
		return starHopper;
	}

	public void setStarHopper(StarHopper starHopper) {
		this.starHopper = starHopper;
	}	
	
}
