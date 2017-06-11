package board;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import player.Player;

public class Star implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private final String name;
	
	private List<Player> sittingPlayers;
	
	private List<Player> playersVisited;
	
	private Integer color;
	
	public int score;

	public Star(String name){
		
		super();		
		
		this.name = name;
		
		sittingPlayers = new ArrayList<Player>();
		
		playersVisited = new ArrayList<Player>(); 
		
	}
	
	public void removePlayer(Player player){
		
		sittingPlayers.remove(player);
		
	}
	
	public void addPlayer(Player player){
		
		if (!sittingPlayers.contains(player))
			
			sittingPlayers.add(player);
		
		if (!playersVisited.contains(player))
			
			playersVisited.add(player);
		
	}
	
	public void planToRevisit(Player player){
		
		playersVisited.remove(player);
		
	}
	
	public String getName() {
		
		return name;
		
	}

	public List<Player> getSittingPlayers() {
		
		return sittingPlayers;
		
	}	
	
	public List<Player> getPlayersVisited() {
		
		return playersVisited;
		
	}	

	public Integer getColor() {
		
		return color;
		
	}

	public void setColor(Integer color) {
		
		this.color = color;
		
	}
	
	public void calculateScore(Board board, int maxScore){
		
		double visitedFactor = (board.getPlayers().size() - getPlayersVisited().size()) / (double)board.getPlayers().size();
		
		this.score = new Double(Math.floor(maxScore * visitedFactor)).intValue();
		
	}

	@Override	
	public boolean equals(Object otherStar){
		
		if (otherStar instanceof Star)
			
			return this.getName().equals(((Star)otherStar).getName());
		
		else
			
			return false;
		
	}
	
}
