package json;

import java.io.Serializable;

public class PlayerGroupJSON implements Serializable {

	private static final long serialVersionUID = 1L;

	private String playerType;
	
	private int number;

	public String getPlayerType() {
		return playerType;
	}

	public void setPlayerType(String playerType) {
		this.playerType = playerType;
	}

	public int getNumber() {
		return number;
	}

	public void setNumber(int number) {
		this.number = number;
	}
			
}
