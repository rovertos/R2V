package player;

import java.util.Iterator;
import java.util.Random;
import java.util.Set;

import board.Board;
import board.Star;
import board.Wormhole;

public class RandomBot extends Robot {

	public static String TYPE = "RANDOM-BOT";
	
	public RandomBot(String name, Star startingStar, int startingCredits){
		
		super(name, startingStar, startingCredits, RandomBot.TYPE);
		
	}
	
	public Star pickNewDestination(Board board){
		
		if (this.getCredits() < this.getPosition().getSittingPlayers().size()){
			
			return this.getPosition();
			
		} else {
		
			Star randomDestination = null;
			
			Set<Wormhole> wormholeSet = board.getConstellation().edgesOf(this.getPosition());					
			
			Iterator<Wormhole> iter = wormholeSet.iterator();
			
		    int random = new Random().nextInt(wormholeSet.size());
		    
		    while (iter.hasNext()){
		    	
		    	Wormhole wormhole = iter.next();
		    	
		        if (random-- == 0) {
		        	
		        	randomDestination = wormhole.getExitPoint(this.getPosition());
		        	
		        	break;
		            
		        }
		    }
			
			return randomDestination;
		
		}
		
	}
	
}
