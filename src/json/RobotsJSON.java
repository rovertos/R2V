package json;

import java.io.Serializable;

public class RobotsJSON implements Serializable {

	private static final long serialVersionUID = 1L;

	private String type;
	
	private int actives;
	
	private int initial;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getActives() {
		return actives;
	}

	public void setActives(int actives) {
		this.actives = actives;
	}

	public int getInitial() {
		return initial;
	}

	public void setInitial(int initial) {
		this.initial = initial;
	}	
	
}
