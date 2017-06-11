package board;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import pattern.PatternRegistry;
import player.Player;
import player.Robot;
import player.StarHopper;

public class Board {

	private Constellation constellation;
	
	private List<Robot> robots;
	
	public StarHopper starHopper;
	
	private HashMap<String,Star> starMap = new HashMap<String,Star>();
	
	private Star startingStar;
	
	private PatternRegistry preg;
	
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
	
	public void setPreg(PatternRegistry preg) {
		this.preg = preg;
	}

	public PatternRegistry getPreg() {
		return preg;
	}

	public List<Player> getPlayers(){
		
		ArrayList<Player> players = new ArrayList<Player>();
		
		players.addAll(robots);
		
		players.add(starHopper);
		
		return players;
		
	}

	public void setRobots(List<Robot> robots) {
		this.robots = robots;
	}
	
}
