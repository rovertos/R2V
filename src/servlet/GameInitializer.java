package servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import board.BoardMaster;
import json.FactoryJSON;
import json.InitializationJSON;
import util.JsonUtil;

/**
 * Servlet implementation class GameInitializer
 */
public class GameInitializer extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GameInitializer() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		String result = null;
		
		String exportMin = request.getParameter("min");
		
		String startingNodeId = request.getParameter("start");
		
		int startingCredits = Integer.parseInt(request.getParameter("creds"));
		
		int totRandomBots = Integer.parseInt(request.getParameter("rnds"));
		
		int totRushBots = Integer.parseInt(request.getParameter("rush"));		
		
		System.out.println("========= INITIALIZING =========");
		
		System.out.println("exportMin="+exportMin);
		
		System.out.println("startingNodeId="+startingNodeId);
		
		System.out.println("startingCredits="+startingCredits);
		
		System.out.println("totRandomBots="+totRandomBots);
		
		System.out.println("totRushBots="+totRushBots);
		
		BoardMaster boardMaster = BoardMaster.getInstance();
		
		boardMaster.layTheBoard(exportMin);
		
		boardMaster.sitThePlayers(startingNodeId, startingCredits, totRandomBots, totRushBots);
		
		InitializationJSON initialization = FactoryJSON.makeInitialization(boardMaster.getBoard());
		
		try {
			
			result = JsonUtil.toJSON(initialization);
			
			response.setContentType("application/json");
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
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
