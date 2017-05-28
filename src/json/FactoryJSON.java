package json;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import board.Board;
import board.Star;
import player.Player;

public class FactoryJSON {

	public static PositionJSON makePosition(Board board){
		
		PositionJSON position = new PositionJSON();
		
		Iterator<Star> iter = board.getConstellation().vertexSet().iterator();
		
		ArrayList<CrowdJSON> crowds = new ArrayList<CrowdJSON>();
		
		while (iter.hasNext()){
			
			Star star = iter.next();
			
			CrowdJSON crowd = new CrowdJSON();
			
			crowd.setStarId(star.getName());
			
			List<Player> sittingPlayers = star.getSittingPlayers();
			
			HashMap<String, PlayerGroupJSON> groupMap = new HashMap<String, PlayerGroupJSON>();
			
			for (Player player: sittingPlayers){
				
				String playerType = player.getType();
				
				if (groupMap.containsKey(playerType)){
					
					PlayerGroupJSON playerGroup = groupMap.get(playerType);
					
					playerGroup.setNumber(playerGroup.getNumber()+1);
					
				} else {
					
					PlayerGroupJSON playerGroup = new PlayerGroupJSON();
					
					playerGroup.setPlayerType(playerType);
					
					playerGroup.setNumber(1);
					
					groupMap.put(playerType, playerGroup);
					
				}
				
			}
			
			ArrayList<PlayerGroupJSON> playerGroupList = new ArrayList<PlayerGroupJSON>(groupMap.values());
			
			crowd.setTotal(sittingPlayers.size());
			
			crowd.setPlayerGroups(playerGroupList);
			
			crowds.add(crowd);
			
		}
		
		position.setCrowds(crowds);
		
		Collections.sort(board.getRobots());
		
		ArrayList<RankedPlayerJSON> rankedPlayers = new ArrayList<RankedPlayerJSON>();
		
		int numberOfStars = board.getConstellation().vertexSet().size();
		
		// TODO: Rank humans with robots too
		
		for (Player player: board.getRobots()){
			
			RankedPlayerJSON rankedPlayer = new RankedPlayerJSON();
			
			rankedPlayer.setName(player.getName());
			
			rankedPlayer.setScore(player.getScore());
			
			rankedPlayer.setPosition(player.getPosition().getName());
			
			rankedPlayer.setCredits(player.getCredits());
			
			rankedPlayer.setVisited(player.getStarsVisitedThisRound().size() + "/" + numberOfStars + " (" + player.getRoundsCompleted() + ")");
			
			rankedPlayers.add(rankedPlayer);
			
		}
		
		position.setPlayers(rankedPlayers);
		
		return position;
		
	}
	
}