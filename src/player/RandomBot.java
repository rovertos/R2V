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
		
		if (this.getCredits() < this.getPosition().getSittingPlayers().size()){
			
			chosenDestination = this.getPosition();
			
		} else {
		
			Star randomDestination = AI.getRandomDestination(board, this.getPosition(), false);
			
			chosenDestination = randomDestination;
		
		}
		
		return chosenDestination;
		
	}
	
}
