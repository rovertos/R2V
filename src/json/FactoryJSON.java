package json;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import board.Board;
import board.Star;
import player.Player;
import player.RandomBot;
import player.RobotTypes;
import player.RushBot;

public class FactoryJSON {

	public static PositionJSON makePosition(Board board){
		
		PositionJSON position = new PositionJSON();
		
		Iterator<Star> iter = board.getConstellation().vertexSet().iterator();
		
		ArrayList<CrowdJSON> crowds = new ArrayList<CrowdJSON>();
		
		HashMap<String,Integer> robotsMap = new HashMap<String,Integer>();
		
		while (iter.hasNext()){
			
			Star star = iter.next();
			
			CrowdJSON crowd = new CrowdJSON();
			
			crowd.setStarId(star.getName());
			
			crowd.setVisited(star.getPlayersVisited().size());
			
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
				
				if (robotsMap.containsKey(playerType)){
					
					Integer count = robotsMap.get(playerType);
					
					robotsMap.put(playerType, new Integer(count.intValue() + 1));
					
				} else {
					
					robotsMap.put(playerType, new Integer(1));
					
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
		
		//TODO: PROPERLY Use enum for robot types 
		
		ArrayList<RobotsJSON> robots = new ArrayList<RobotsJSON>();
		
		for (RobotTypes rt: RobotTypes.values()){
			
			if (robotsMap.containsKey(rt.toString())){
				
				RobotsJSON rjson = new RobotsJSON();
				
				rjson.setType(rt.toString());
				
				rjson.setActives(robotsMap.get(rt.toString()).intValue());
				
				switch(rt.toString()){
					
					case(RandomBot.TYPE): rjson.setInitial(RandomBot.INITIAL); break;
					
					case(RushBot.TYPE): rjson.setInitial(RushBot.INITIAL);
					
				}
				
				robots.add(rjson);
				
			}
			
		}
			
		position.setRobots(robots);
		
		return position;
		
	}
	
	public static InitializationJSON makeInitialization(Board board){
		
		InitializationJSON initialization = new InitializationJSON();
		
		Iterator<Star> iter = board.getConstellation().vertexSet().iterator();
		
		ArrayList<StarJSON> stars = new ArrayList<StarJSON>();
		
		while (iter.hasNext()){
			
			Star star = iter.next();
			
			StarJSON starJSON = new StarJSON();
			
			starJSON.setName(star.getName());
			
			starJSON.setColorIndex(star.getColor().intValue());
			
			stars.add(starJSON);
			
		}
		
		initialization.setStars(stars);
		
		return initialization;
		
	}
}
