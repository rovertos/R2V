package board;

import org.jgrapht.graph.SimpleWeightedGraph;

public class Constellation extends SimpleWeightedGraph<Star, Wormhole> {

	private static final long serialVersionUID = 1L;

	public Constellation(Class<? extends Wormhole> edgeClass) {
		super(edgeClass);
		// TODO Auto-generated constructor stub
	}

}
