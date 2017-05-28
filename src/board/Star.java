package board;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import player.Player;

public class Star implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private final String name;
	
	private List<Player> sittingPlayers;

	public Star(String name){
		
		super();		
		
		this.name = name;
		
		sittingPlayers = new ArrayList<Player>();
		
	}
	
	public void removePlayer(Player player){
		
		sittingPlayers.remove(player);
		
	}
	
	public void addPlayer(Player player){
		
		if (!sittingPlayers.contains(player))
			
			sittingPlayers.add(player);
		
	}	
	
	public String getName() {
		
		return name;
		
	}

	public List<Player> getSittingPlayers() {
		
		return sittingPlayers;
		
	}	
	
}
