package pattern;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Pattern {

	private List<Integer> sequence;

	private List<Integer> reverse;
	
	private boolean bidirectional;
	
	public Pattern(List<Integer> sequence, boolean bidirectional){
		
		this.bidirectional = bidirectional;
		
		this.sequence = sequence;
		
		reverse = new ArrayList<Integer>(sequence);
		
		Collections.reverse(reverse);
		
	}
	
	public List<Integer> getSequence() {
		return sequence;
	}
	
	public List<Integer> getReverse() {
		return reverse;
	}	

	public boolean isBidirectional() {
		return bidirectional;
	}
	
	public String toString() {
		
		StringBuffer strBuf = new StringBuffer(""+sequence.get(0));
		
		for (int i=1; i<sequence.size(); i++){
			
			strBuf.append("," + sequence.get(i));
			
		}
		
		return strBuf.toString();
		
	}

	@Override	
	public boolean equals(Object otherPattern){
		
		if (otherPattern instanceof Pattern)
			
			return (this.getSequence().equals(((Pattern)otherPattern).getSequence()) ||
					(this.bidirectional && this.getSequence().equals(((Pattern)otherPattern).getReverse())));
		
		else
			
			return false;
		
	}	
	
}
