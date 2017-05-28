package board;

import java.util.ArrayList;
import java.util.HashMap;

import player.RandomBot;
import player.Robot;
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
		
		// Finally, iterate to create & add all edges
		
		for (int i=0; i<adjacencies.length; i++){
			
			String[] nodes = adjacencies[i].split(",");
			
			Star source = board.getStar(nodes[0]);
			
			for (int j=1; j<nodes.length; j++){
				
				Star target = board.getStar(nodes[j]);
				
				constellation.addEdge(source, target);
				
			}
			
		}
		
		board.setConstellation(constellation);
		
	}
	
	
	public void sitThePlayers(String startingNodeId, int startingCredits, int totRandomBots){
		
		Star startingStar = this.board.getStar(startingNodeId);
		
		this.board.setStartingStar(startingStar);
		
		ArrayList<Robot> robots = new ArrayList<Robot>();
		
		for (int i=0; i<totRandomBots; i++){
			
			RandomBot rndbot = new RandomBot("RND-" + i, startingStar, startingCredits);
			
			robots.add(rndbot);
			
		}
		
		board.setRobots(robots);
		
	}
	
	public void mobilizeTheRobots(int costMultiplier, int stayingBonus, int newStarScore){
		
		board.TURN++;
		
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
			
			robot.moveToStar(destination);
			
			if (!robot.getStarsVisitedThisRound().contains(destination.getName())){
				
				robot.setScore(robot.getScore() + newStarScore);
								
				if (board.getConstellation().vertexSet().size() == robot.getStarsVisitedThisRound().size() + 1){
					
					robot.setRoundsCompleted(robot.getRoundsCompleted() + 1);
					
					robot.getStarsVisitedThisRound().clear();
					
				}
					
				robot.getStarsVisitedThisRound().add(destination.getName());
				
			}
			
		}
		
	}
	
}
