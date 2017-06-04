package json;

import java.io.Serializable;

public class StarJSON implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String name;
	
	private int colorIndex;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getColorIndex() {
		return colorIndex;
	}

	public void setColorIndex(int colorIndex) {
		this.colorIndex = colorIndex;
	}	
	
}
