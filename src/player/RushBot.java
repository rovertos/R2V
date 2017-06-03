package player;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Random;
import java.util.Set;

import board.Board;
import board.Star;
import board.Wormhole;

public class RushBot extends Robot {

	public static final String TYPE = "RUSH-BOT";
	
	public static int INITIAL;
	
	public RushBot(String name, Star startingStar, int startingCredits){
		
		super(name, startingStar, startingCredits, RushBot.TYPE);
		
	}
	
	@Override
	public Star pickNewDestination(Board board) {
		
		Star chosenDestination = null;
		
		if (this.getCredits() < this.getPosition().getSittingPlayers().size()){
			
			chosenDestination = this.getPosition();
			
		} else {
		
			Set<Wormhole> wormholeSet = board.getConstellation().edgesOf(this.getPosition());
			
			Iterator<Wormhole> iter = wormholeSet.iterator();
			
		    ArrayList<Star> starsNotVisited = new ArrayList<Star>();
		    
		    while (iter.hasNext()){
		    	
		    	Wormhole wormhole = iter.next();
		    	
		    	Star destination = wormhole.getExitPoint(this.getPosition());
		    	
		    	if (!this.getStarsVisitedThisRound().contains(destination.getName()))
		    		
		    		starsNotVisited.add(destination);
		    	
		    }	    
		    
		    if (starsNotVisited.isEmpty()){
		    	
		    	chosenDestination = AI.getRandomDestination(board, this.getPosition(), true);
		    	
		    } else {
		    	
			    int random = new Random().nextInt(starsNotVisited.size());
			    
			    chosenDestination = starsNotVisited.get(random);
		    	
		    }
		
		}
		
		return chosenDestination;
	}

}
