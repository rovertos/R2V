package servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import board.Board;
import board.BoardMaster;
import json.FactoryJSON;
import json.PositionJSON;
import util.JsonUtil;

/**
 * Servlet implementation class GameController
 */
public class GameController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GameController() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		String result = null;
		
		BoardMaster boardMaster = BoardMaster.getInstance();
		
		if (boardMaster.getBoard() != null){
		
			int costMultiplier = Integer.parseInt(request.getParameter("cmult"));
			
			int stayingBonus = Integer.parseInt(request.getParameter("stbon"));
			
			int newStarScore = Integer.parseInt(request.getParameter("newsc"));			
			
			int backTrackPenalty = Integer.parseInt(request.getParameter("btpen"));
						
			String starHopperMove = request.getParameter("shmov") != null ? request.getParameter("shmov") : boardMaster.getBoard().getStartingStar().getName();
			
			int starHopperBid = request.getParameter("shbid") != null ? Integer.parseInt(request.getParameter("shbid")) : 0;
			
			System.out.println("---------- MOVE " + boardMaster.getBoard().TURN + " ----------");
			
			System.out.println("costMultiplier="+costMultiplier);
			
			System.out.println("stayingBonus="+stayingBonus);
			
			System.out.println("newStarScore="+newStarScore);
			
			System.out.println("backTrackPenalty="+backTrackPenalty);
			
			System.out.println("starHopperMove="+starHopperMove);
			
			System.out.println("starHopperBid="+starHopperBid);
			
			boardMaster.mobilizeTheRobots(costMultiplier, stayingBonus, newStarScore, backTrackPenalty, starHopperMove, starHopperBid);			
			
			PositionJSON position = FactoryJSON.makePosition(boardMaster.getBoard());
			
			try {
				
				result = JsonUtil.toJSON(position);
				
				response.setContentType("application/json");
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		
		} else {
			
			result = "Board not yet initialized";
			
		}		
				
		response.getWriter().write(result);
		
		response.getWriter().flush();
		
		response.getWriter().close();		
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
