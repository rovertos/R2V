package pattern;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import board.Constellation;
import board.Star;
import board.Wormhole;

public class PatternRegistry {
	
	private static PatternRegistry instance = new PatternRegistry();

	private List<Pattern> patterns;
	
	private List<Integer> weights;
	
	public int patternLength;
	
	public boolean bidirectional;
	
	public static PatternRegistry getInstance(){
		
		return instance;
		
	}
	
	public void register(Constellation constellation, int patternLength, boolean bidirectional){
		
		this.patterns = new ArrayList<Pattern>();
		
		this.weights = new ArrayList<Integer>();
		
		this.patternLength = patternLength;
		
		this.bidirectional = bidirectional;
		
		Iterator<Wormhole> wIter = constellation.edgeSet().iterator();
		
		while (wIter.hasNext()){
			
			Wormhole wormhole = wIter.next();
			
			wormhole.clearMemberships();
			
		}
		
		Iterator<Star> sIter = constellation.vertexSet().iterator();
		
		while (sIter.hasNext()){
						
			Star star = sIter.next();
			
			ArrayList<Star> starsCrawled = new ArrayList<Star>();
			
			ArrayList<Wormhole> wormholesCrawled = new ArrayList<Wormhole>();
			
			ArrayList<Integer> sequenceCrawled = new ArrayList<Integer>();
			
			//System.out.println(">>>>>>>>>>>>>>>>>> " + star.getName() + " >>>>>>>>>>>>>>>>>>");			
			
			this.crawlStarsForPatterns(constellation, star, starsCrawled, wormholesCrawled, sequenceCrawled);
			
			//System.out.println("<<<<<<<<<<<<<<<<< " + star.getName() + " <<<<<<<<<<<<<<<<<");
			
		}
		
	}
	
	private void crawlStarsForPatterns(Constellation constellation, Star star, List<Star> starsCrawled, List<Wormhole> wormholesCrawled, List<Integer> sequenceCrawled){
				
		if (sequenceCrawled.size() == patternLength-1){
					
			ArrayList<Integer> newSequence = new ArrayList<Integer>(sequenceCrawled);
			
			newSequence.add(star.getColor());
			
			Pattern pattern = new Pattern(newSequence, bidirectional);
			
			//System.out.println("@@ " + star.getName() + " " + star.getColor() + " REGISTER " + pattern.toString() + " for " + wormholesCrawled.get(0).getName() + " and " + wormholesCrawled.get(1).getName());
			
			this.registerPattern(pattern, wormholesCrawled);
			
		} else {
			
			ArrayList<Star> newStarsCrawled = new ArrayList<Star>(starsCrawled);
			
			newStarsCrawled.add(star);
			
			Set<Wormhole> wormholeSet = constellation.edgesOf(star);
			
			//System.out.println("@STAR " + star.getName() + " " + star.getColor());
			
			Iterator<Wormhole> iter = wormholeSet.iterator();
			
			ArrayList<Integer> newSequence = new ArrayList<Integer>(sequenceCrawled);
			
			newSequence.add(star.getColor());
			
			while (iter.hasNext()){
				
				Wormhole wormhole = iter.next();
				
				//System.out.println("@WORM " + wormhole.getSource().getName() + "_" + wormhole.getTarget().getName());
				
				Star destination = wormhole.getExitPoint(star);
				
				if (!starsCrawled.contains(destination)){
					
					ArrayList<Wormhole> newWormholes = new ArrayList<Wormhole>(wormholesCrawled);
					
					newWormholes.add(wormhole);
					
					//System.out.println("-MOVE to " + destination.getName() + " " + destination.getColor());
					
					crawlStarsForPatterns(constellation, destination, newStarsCrawled, newWormholes, newSequence);
				
				} else {
					
					//System.out.println("-SKIP " + destination.getName());
					
				}
				
			}
			
		}
		
	}
	
	private void registerPattern(Pattern pattern, List<Wormhole> wormholes){
		
		int pindex = patterns.indexOf(pattern);
		
		if (pindex > -1){
			
			Integer weight = weights.remove(pindex);
			
			weight = new Integer(weight.intValue() + 1);
			
			weights.add(pindex, weight);
			
		} else {
			
			patterns.add(pattern);
			
			weights.add(new Integer(1));
			
		}
		
		for (Wormhole wormhole: wormholes){
			
			wormhole.addPatternMembership(pattern);
			
		}
		
	}
	
	public int getPatternWeight(Pattern pattern){
		
		int pindex = patterns.indexOf(pattern);
		
		if (pindex > -1)
			
			return weights.get(pindex).intValue();
		
		else
			
			return 0;
		
	}

	public List<Pattern> getPatterns() {
		
		return patterns;
		
	}	
	
}
