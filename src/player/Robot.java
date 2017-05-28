package player;

import board.Board;
import board.Star;

public abstract class Robot extends Player {

	public Robot(String name, Star startingStar, int startingCredits, String type){
		
		super(name, startingStar, startingCredits, type);
		
	}
	
	public abstract Star pickNewDestination(Board board);
	
}
