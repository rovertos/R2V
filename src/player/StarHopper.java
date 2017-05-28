package player;

import board.Star;

public class StarHopper extends Player {

	public static String type = "HUMAN";
	
	public StarHopper(String name, Star startingStar, int startingCredits){
		
		super(name, startingStar, startingCredits, StarHopper.type);
		
	}
	
}
