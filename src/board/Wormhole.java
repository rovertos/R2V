package board;

import java.util.ArrayList;

import org.jgrapht.graph.DefaultWeightedEdge;

import pattern.Pattern;

public class Wormhole extends DefaultWeightedEdge {

	private static final long serialVersionUID = 1L;
	
	private ArrayList<Pattern> patternMemberships = new ArrayList<Pattern>();
	
	private double weight;
	
	public Star getSource(){
		
		return (Star)super.getSource();
		
	}
	
	public Star getTarget(){
		
		return (Star)super.getTarget();
		
	}	
	
	public ArrayList<Pattern> getPatternMemberships() {
		
		return patternMemberships;
		
	}

	public void addPatternMembership(Pattern pattern){
		
		if (!patternMemberships.contains(pattern))
			
			patternMemberships.add(pattern);
		
	}	
	
	@Override
	public double getWeight() {
		
		return weight;
		
	}

	public void setWeight(double weight) {
		
		this.weight = weight;
		
	}

	public Star getExitPoint(Star entryPoint){
		
		if (entryPoint.getName().equals(getSource().getName()))
			
			return getTarget();
		
		else
			
			return getSource();
		
	}
	
}
