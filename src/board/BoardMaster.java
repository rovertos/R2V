package board;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

import org.jgrapht.alg.ChromaticNumber;

import pattern.Pattern;
import pattern.PatternRegistry;
import player.Player;
import player.RandomBot;
import player.Robot;
import player.RushBot;
import player.StarHopper;
import transition.CrowdMovement;

public class BoardMaster {
	
	private static BoardMaster instance = new BoardMaster();
	
	private BoardMaster(){}
	
	private Board board;
	
	private int backtrackPenalty;
	
	private int chroma;
	
	private int sequence;
	
	private int bidirectional;

	public static BoardMaster getInstance() {
		return instance;
	}

	public Board getBoard() {
		return board;
	}

	public void setBoard(Board board) {
		this.board = board;
	}
	
	public void layTheBoard(String exportMin, int chroma, int sequence, int bidirectional){
		
		this.board = new Board();
		
		this.chroma = chroma;
		
		this.sequence = sequence;
		
		this.bidirectional = bidirectional;
		
		Constellation constellation = new Constellation(Wormhole.class);
		
		String[] adjacencies = exportMin.split("-");
		
		// First iterate to find all distinct vertices
		
		ArrayList<String> distinctNodeIds = new ArrayList<String>();
		
		for (int i=0; i<adjacencies.length; i++){
			
			String[] nodes = adjacencies[i].split(",");
			
			for (int j=0; j<nodes.length; j++){
				
				if (!distinctNodeIds.contains(nodes[j]))
					
					distinctNodeIds.add(nodes[j]);
				
			}
			
		}
		
		// Then iterate all distinct node ids to create & add all vertices
		
		for (String nodeId: distinctNodeIds){
			
			Star star = new Star(nodeId);
			
			constellation.addVertex(star);
			
			board.addStar(nodeId, star);
			
		}
		
		// Iterate to create & add all edges
		
		for (int i=0; i<adjacencies.length; i++){
			
			String[] nodes = adjacencies[i].split(",");
			
			Star source = board.getStar(nodes[0]);
			
			for (int j=1; j<nodes.length; j++){
				
				Star target = board.getStar(nodes[j]);
				
				constellation.addEdge(source, target);
				
			}
			
		}
		
		// Perform coloring
		
		if (chroma == 0){
		
			Map<Integer, Set<Star>> chromaticMap = ChromaticNumber.findGreedyColoredGroups(constellation);				
			
			Iterator<Integer> chromaIter = chromaticMap.keySet().iterator();
			
			while (chromaIter.hasNext()){
				
				Integer color = chromaIter.next();
				
				Set<Star> stars = chromaticMap.get(color);
				
				Iterator<Star> starIter = stars.iterator();
				
				while (starIter.hasNext()){
					
					Star star = starIter.next();
					
					star.setColor(color);
					
				}
				
			}
		
		} else if (chroma > 0){
						
			Iterator<Star> iter = constellation.vertexSet().iterator();
			
			int colors = chroma;
			
			while (iter.hasNext()){
				
				int randomNum = ThreadLocalRandom.current().nextInt(colors);
				
				Star star = iter.next();
				
				star.setColor(new Integer(randomNum));
				
			}
			
		}
		
		// Register patterns with weights
		
		registerPatterns(constellation);
		
		board.setConstellation(constellation);
		
	}
	
	private void registerPatterns(Constellation constellation){
		
		PatternRegistry preg = PatternRegistry.getInstance();
		
		preg.register(constellation, sequence, (bidirectional == 1));
		
		Iterator<Wormhole> iter = constellation.edgeSet().iterator();
		
		while (iter.hasNext()){
			
			Wormhole wormhole = iter.next();
			
			int totPatterWeight = 0;
			
			for (Pattern pattern: wormhole.getPatternMemberships()){
				
				totPatterWeight += preg.getPatternWeight(pattern);
				
			}
			
			wormhole.setWeight(totPatterWeight);
			
		}		
		
	}
	
	
	public void sitThePlayers(String startingNodeId, int startingCredits, int totRandomBots, int totRushBots){
		
		Star startingStar = this.board.getStar(startingNodeId);
		
		board.setStartingStar(startingStar);
		
		board.starHopper = new StarHopper("YOU", startingStar, startingCredits);
		
		ArrayList<Robot> robots = new ArrayList<Robot>();
		
		RandomBot.INITIAL = totRandomBots;
		
		for (int i=0; i<totRandomBots; i++){
			
			RandomBot rndbot = new RandomBot("RND-" + i, startingStar, startingCredits);
			
			robots.add(rndbot);
			
		}
		
		RushBot.INITIAL = totRushBots;
		
		for (int i=0; i<totRushBots; i++){
			
			RushBot rushbot = new RushBot("RUSH-" + i, startingStar, startingCredits);
			
			robots.add(rushbot);
			
		}
		
		board.setRobots(robots);
		
	}
	
	public void mobilizeTheRobots(int costMultiplier, int stayingBonus, int newStarScore, int backtrackPenalty, String starHopperMove, int starHopperBid){
		
		this.backtrackPenalty = backtrackPenalty;
		
		if (board.TURN > 0){
						
			CrowdMovement crowdMovement = new CrowdMovement(costMultiplier, stayingBonus);		
			
			HashMap<String,Star> selectedDestinations = new HashMap<String,Star>();			
			
			// Handle Starhopper move
			
			Star starHopperNewPosition = board.getStar(starHopperMove);
			
			crowdMovement.registerSingleMove(board.starHopper, starHopperNewPosition);
			
			// Order the bots to pick their destinations
			
			for (Robot robot: board.getRobots()){
				
				Star destination = null;
				
				if (robot.getCredits() <= robot.getPosition().getSittingPlayers().size() * costMultiplier){
				
					destination = robot.getPosition();
				
				} else {
					
					destination = robot.pickNewDestination(board);
					
				}
				
				crowdMovement.registerSingleMove(robot, destination);
				
				selectedDestinations.put(robot.getName(), destination);				
				
			}
			
			// Apply movement costs for Robots & award score bonuses
			
			crowdMovement.calculateCosts();
			
			for (Robot robot: board.getRobots()){
				
				int cost = crowdMovement.getCostForPlayer(robot);
				
				robot.setCredits(robot.getCredits() + cost);
				
				Star destination = selectedDestinations.get(robot.getName());
							
				adjustScore(robot, destination);
				
				robot.moveToStar(destination);
				
			}
			
			// Apply movement costs for StarHopper & award score bonus
			
			int cost = crowdMovement.getCostForPlayer(board.starHopper);
			
			board.starHopper.setCredits(board.starHopper.getCredits() + cost);
			
			adjustScore(board.starHopper, starHopperNewPosition);
			
			board.starHopper.moveToStar(starHopperNewPosition);
		
		}
		
		// Assign star scores
		
		Iterator<Star> iter = board.getConstellation().vertexSet().iterator();
		
		while (iter.hasNext()){
			
			Star star = iter.next();
			
			star.calculateScore(board, newStarScore);
			
		}
		
		board.TURN++;
		
	}
	
	public void adjustScore(Player player, Star destination){
				
		if (!player.getStarsVisitedThisRound().contains(destination)){
			
			player.setScore(player.getScore() + destination.score);
			
			if (board.getConstellation().vertexSet().size() == player.getStarsVisitedThisRound().size() + 1){
				
				player.completeRound();
				
			}
			
		} else if (!player.getPosition().equals(destination)){
			
			if (player.getScore() > backtrackPenalty)
			
				player.setScore(player.getScore() - backtrackPenalty);
				
			else
				
				player.setScore(0);
			
		}		
		
	}
	
	public void applyAnomaly(String anomalyNode, int color){
		
		Star star = board.getStar(anomalyNode);
		
		star.setColor(color);
		
		registerPatterns(board.getConstellation());
		
	}
	
}
