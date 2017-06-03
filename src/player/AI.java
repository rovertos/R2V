package player;

import java.util.Iterator;
import java.util.Random;
import java.util.Set;

import board.Board;
import board.Star;
import board.Wormhole;

public class AI {

	public static Star getRandomDestination(Board board, Star position, boolean rush){
		
		Star randomDestination = position;
		
		Set<Wormhole> wormholeSet = board.getConstellation().edgesOf(position);
		
		Iterator<Wormhole> iter = wormholeSet.iterator();
		
		int random = rush ? new Random().nextInt(wormholeSet.size()) : new Random().nextInt(wormholeSet.size() + 1);
		
	    while (iter.hasNext()){
	    	
	    	Wormhole wormhole = iter.next();
	    	
	        if (random-- == 0) {
	        	
	        	randomDestination = wormhole.getExitPoint(position);
	        	
	        	break;
	            
	        }
	    }
	    
		return randomDestination;
		
	}
	
}
