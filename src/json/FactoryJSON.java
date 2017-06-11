package json;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import board.Board;
import board.Star;
import board.Wormhole;
import pattern.Pattern;
import pattern.PatternRegistry;
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
			
			crowd.setScore(star.score);
			
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
		
		List<Player> playerList = board.getPlayers();
		
		Collections.sort(playerList);
		
		int playerRank = playerList.indexOf(board.starHopper) + 1;
		
		ArrayList<RankedPlayerJSON> rankedPlayers = new ArrayList<RankedPlayerJSON>();
		
		int numberOfStars = board.getConstellation().vertexSet().size();
		
		for (Player player: playerList){
			
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
		
		StarHopperJSON starHopperJSON = new StarHopperJSON();
		
		starHopperJSON.setRank(playerRank);
		
		starHopperJSON.setCredits(board.starHopper.getCredits());
		
		starHopperJSON.setLocation(board.starHopper.getPosition().getName());
		
		starHopperJSON.setScore(board.starHopper.getScore());
		
		ArrayList<String> visited = new ArrayList<String>();
		
		for (Star star: board.starHopper.getStarsVisitedThisRound()){
			
			if (!star.getName().equals(board.starHopper.getPosition().getName()))
				
				visited.add(star.getName());
			
		}
		
		starHopperJSON.setVisited(visited);
		
		position.setStarHopper(starHopperJSON);
		
		// Find winner if any
		
		if (playerList.get(0).getScore() > playerList.get(1).getScore() &&
				
				playerList.get(0).getRoundsCompleted() > playerList.get(1).getRoundsCompleted())
			
			position.setWinner(playerList.get(0).getName());
		
		return position;
		
	}
	
	public static InitializationJSON makeInitialization(Board board){
		
		InitializationJSON initialization = new InitializationJSON();
		
		Iterator<Star> sIter = board.getConstellation().vertexSet().iterator();
		
		ArrayList<StarJSON> stars = new ArrayList<StarJSON>();
		
		while (sIter.hasNext()){
			
			Star star = sIter.next();
			
			StarJSON starJSON = new StarJSON();
			
			starJSON.setName(star.getName());
			
			starJSON.setColorIndex(star.getColor().intValue());
			
			stars.add(starJSON);
			
		}
		
		ArrayList<WormholeJSON> wormholes = new ArrayList<WormholeJSON>();
		
		PatternRegistry preg = PatternRegistry.getInstance();
		
		Iterator<Wormhole> wIter = board.getConstellation().edgeSet().iterator();
		
		while (wIter.hasNext()){
			
			Wormhole wormhole = wIter.next();
			
			WormholeJSON wormholeJSON = new WormholeJSON();
						
			wormholeJSON.setName(wormhole.getName());
			
			wormholeJSON.setWeight((int)wormhole.getWeight());
			
			ArrayList<String> patternStrings = new ArrayList<String>();
			
			ArrayList<Pattern> patterns = wormhole.getPatternMemberships();
			
			for (Pattern pattern: patterns){
				
				patternStrings.add(pattern.toString());
				
			}
			
			wormholeJSON.setPatterns(patternStrings);
			
			wormholes.add(wormholeJSON);
			
		}
		
		initialization.setStars(stars);
		
		Collections.sort(wormholes);
		
		double minWeight = wormholes.get(wormholes.size()-1).getWeight();
		
		for (WormholeJSON wormhole: wormholes){
			
			wormhole.setWeight(wormhole.getWeight()/minWeight);
			
		}		
		
		initialization.setWormholes(wormholes);
		
		ArrayList<PatternJSON> patterns = new ArrayList<PatternJSON>();
		
		for (Pattern pattern: preg.getPatterns()){
			
			PatternJSON patternJSON = new PatternJSON();
			
			patternJSON.setSequence(pattern.getSequence());
			
			patternJSON.setWeight(preg.getPatternWeight(pattern));
			
			patterns.add(patternJSON);
			
		}
		
		Collections.sort(patterns);
		
		initialization.setPatterns(patterns);
		
		return initialization;
		
	}
}
