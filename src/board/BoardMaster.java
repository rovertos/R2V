package board;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.jgrapht.alg.ChromaticNumber;

import player.RandomBot;
import player.Robot;
import player.RushBot;
import transition.CrowdMovement;

public class BoardMaster {
	
	private static BoardMaster instance = new BoardMaster();
	
	private BoardMaster(){}
	
	private Board board;

	public static BoardMaster getInstance() {
		return instance;
	}

	public Board getBoard() {
		return board;
	}

	public void setBoard(Board board) {
		this.board = board;
	}
	
	public void layTheBoard(String exportMin){
		
		this.board = new Board();
		
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
		
		board.setConstellation(constellation);
		
	}
	
	
	public void sitThePlayers(String startingNodeId, int startingCredits, int totRandomBots, int totRushBots){
		
		Star startingStar = this.board.getStar(startingNodeId);
		
		this.board.setStartingStar(startingStar);
		
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
	
	public void mobilizeTheRobots(int costMultiplier, int stayingBonus, int newStarScore){
		
		if (board.TURN > 0){
		
			CrowdMovement crowdMovement = new CrowdMovement(costMultiplier, stayingBonus);		
			
			HashMap<String,Star> selectedDestinations = new HashMap<String,Star>();
			
			// Order the bots to pick their destinations
			
			for (Robot robot: board.getRobots()){
				
				Star destination = robot.pickNewDestination(board);
				
				crowdMovement.registerSingleMove(robot, destination);
				
				selectedDestinations.put(robot.getName(), destination);
				
			}
			
			// Apply movement costs & award score bonuses
			
			crowdMovement.calculateCosts();
			
			for (Robot robot: board.getRobots()){
				
				int cost = crowdMovement.getCostForPlayer(robot);
				
				robot.setCredits(robot.getCredits() + cost);
				
				Star destination = selectedDestinations.get(robot.getName());
							
				if (!robot.getStarsVisitedThisRound().contains(destination)){
					
					robot.setScore(robot.getScore() + newStarScore);
									
					if (board.getConstellation().vertexSet().size() == robot.getStarsVisitedThisRound().size() + 1){
						
						robot.completeRound();
						
					}
					
				}
				
				robot.moveToStar(destination);			
				
			}
		
		}
		
		board.TURN++;
		
	}
	
}
