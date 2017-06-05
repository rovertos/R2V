package player;

import java.util.ArrayList;
import java.util.List;

import board.Star;
import transition.SingleMove;

public class Player implements Comparable<Player> {

	private String name;
	
	private int credits;
	
	private int score;
	
	private Star position;
	
	private List<SingleMove> movementHistory;
	
	private String type;
	
	private int roundsCompleted = 0;
	
	private List<Star> starsVisitedThisRound;
	
	public Player(String name, Star startingStar, int startingCredits, String type){
		
		this.name = name;
		
		this.type = type;
		
		this.starsVisitedThisRound = new ArrayList<Star>();
		
		this.movementHistory = new ArrayList<SingleMove>();		
		
		this.moveToStar(startingStar);
		
		this.setCredits(startingCredits);
		
		this.setScore(0);
		
	}
	
	public void moveToStar(Star destination){
		
		if (position!=null && !position.equals(destination)){
						
			position.removePlayer(this);
		
		}
		
		destination.addPlayer(this);
		
		position = destination;
		
		starsVisitedThisRound.add(destination);
		
	}	
	
	public void completeRound(){
		
		setRoundsCompleted(this.getRoundsCompleted() + 1);
				
		for (Star star: starsVisitedThisRound){
			
			star.planToRevisit(this);
			
		}
		
		starsVisitedThisRound.clear();
		
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getCredits() {
		return credits;
	}

	public void setCredits(int credits) {
		this.credits = credits;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}	

	public Star getPosition() {
		return position;
	}

	public List<SingleMove> getMovementHistory() {
		return movementHistory;
	}

	public void setMovementHistory(List<SingleMove> movementHistory) {
		this.movementHistory = movementHistory;
	}	

	public String getType() {
		return type;
	}	

	public int getRoundsCompleted() {
		return roundsCompleted;
	}	

	public void setRoundsCompleted(int roundsCompleted) {
		this.roundsCompleted = roundsCompleted;
	}

	public List<Star> getStarsVisitedThisRound() {
		return starsVisitedThisRound;
	}
	
	@Override	
	public boolean equals(Object otherPlayer){
		
		if (otherPlayer instanceof Player)
			
			return this.getName().equals(((Player)otherPlayer).getName());
		
		else
			
			return false;
		
	}

	@Override
	public int compareTo(Player otherPlayer) {
		
		if (otherPlayer instanceof Player){
			
			return ((Player)otherPlayer).score - this.score;
			
		} else 
		
			return 0;
		
	}
	
}
