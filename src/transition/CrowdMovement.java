package transition;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import board.Star;
import player.Player;

public class CrowdMovement {

	//public static ArrayList<CrowdMovement> movementHistory = new ArrayList<CrowdMovement>();
	
	private HashMap<String, ArrayList<Player>> movementMap = new HashMap<String, ArrayList<Player>>();
	
	private HashMap<String, Integer> calculatedCosts = new HashMap<String, Integer>();
	
	private int costMultiplier;
	
	private int stayingBonus;
	
	public CrowdMovement(int costMultiplier, int stayingBonus){
		
		this.costMultiplier = costMultiplier;
		
		this.stayingBonus = stayingBonus;
		
	}
		
	public void registerSingleMove(Player player, Star target){
		
		String origin = player.getPosition().getName();
		
		String destination = target.getName();
		
		String movementKey = origin + "-" + destination;

		if (movementMap.containsKey(movementKey)){
			
			movementMap.get(movementKey).add(player);
			
		} else {
			
			ArrayList<Player> players = new ArrayList<Player>();
			
			players.add(player);
			
			movementMap.put(movementKey, players);
			
		}
		
	}
	
	public void calculateCosts(){
		
		Iterator<String> iter = movementMap.keySet().iterator();
		
		while (iter.hasNext()){
			
			String movementKey = iter.next();
						
			Integer movementCost;
			
			String[] points = movementKey.split("-");
			
			if (points[0].equals(points[1])){
				
				movementCost = new Integer(this.stayingBonus);
				
			} else {
				
				ArrayList<Player> players = movementMap.get(movementKey);				
			
				movementCost = new Integer(-this.costMultiplier * players.size());
			
			}
			
			calculatedCosts.put(movementKey, movementCost);
			
		}
		
	}
	
	public int getCostForPlayer(Player player){
		
		int cost = 0;
		
		Iterator<String> iter = movementMap.keySet().iterator();
		
		while (iter.hasNext()){
			
			String movementKey = iter.next();
			
			ArrayList<Player> players = movementMap.get(movementKey);
			
			if (players.contains(player)){
				
				cost = calculatedCosts.get(movementKey).intValue();
				
				break;
				
			}
			
		}
		
		return cost;
		
	}
	
}
