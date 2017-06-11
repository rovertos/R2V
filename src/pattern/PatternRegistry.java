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
		
		Iterator<Star> iter = constellation.vertexSet().iterator();
		
		while (iter.hasNext()){
						
			Star star = iter.next();
			
			ArrayList<Star> starsCrawled = new ArrayList<Star>();
			
			ArrayList<Wormhole> wormholesCrawled = new ArrayList<Wormhole>();
			
			ArrayList<Integer> sequenceCrawled = new ArrayList<Integer>();
			
			this.crawlStarsForPatterns(constellation, star, starsCrawled, wormholesCrawled, sequenceCrawled);
			
		}
		
	}
	
	private void crawlStarsForPatterns(Constellation constellation, Star star, List<Star> starsCrawled, List<Wormhole> wormholesCrawled, List<Integer> sequenceCrawled){
		
		Set<Wormhole> wormholeSet = constellation.edgesOf(star);
		
		Iterator<Wormhole> iter = wormholeSet.iterator();		
		
		if (sequenceCrawled.size() == patternLength-1){
			
			while (iter.hasNext()){
				
				Wormhole wormhole = iter.next();
				
				Star destination = wormhole.getExitPoint(star);
				
				if (!starsCrawled.contains(destination)){
					
					ArrayList<Integer> newSequence = new ArrayList<Integer>(sequenceCrawled);
					
					newSequence.add(destination.getColor());
					
					ArrayList<Wormhole> newWormholes = new ArrayList<Wormhole>(wormholesCrawled);
					
					newWormholes.add(wormhole);
					
					Pattern pattern = new Pattern(newSequence, bidirectional);
					
					this.registerPattern(pattern, newWormholes);
					
				}
				
			}
			
		} else {
			
			while (iter.hasNext()){
				
				Wormhole wormhole = iter.next();
				
				Star destination = wormhole.getExitPoint(star);
				
				ArrayList<Star> newStarsCrawled = new ArrayList<Star>(starsCrawled);
				
				newStarsCrawled.add(destination);
				
				ArrayList<Integer> newSequence = new ArrayList<Integer>(sequenceCrawled);
				
				newSequence.add(destination.getColor());
				
				ArrayList<Wormhole> newWormholes = new ArrayList<Wormhole>(wormholesCrawled);
				
				newWormholes.add(wormhole);
				
				crawlStarsForPatterns(constellation, destination, newStarsCrawled, newWormholes, newSequence);
				
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
