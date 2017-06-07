package player;

import board.Board;
import board.Star;

public class RandomBot extends Robot {

	public static final String TYPE = "RAND-BOT";
	
	public static int INITIAL;
	
	public RandomBot(String name, Star startingStar, int startingCredits){
		
		super(name, startingStar, startingCredits, RandomBot.TYPE);
		
	}
	
	public Star pickNewDestination(Board board){
		
		Star chosenDestination = null;
		
		Star randomDestination = AI.getRandomDestination(board, this.getPosition(), false);
		
		chosenDestination = randomDestination;
		
		return chosenDestination;
		
	}
	
}
