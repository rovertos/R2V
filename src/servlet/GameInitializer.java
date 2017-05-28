package servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import board.BoardMaster;

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
		
		String exportMin = request.getParameter("min");
		
		String startingNodeId = request.getParameter("start");
		
		int startingCredits = Integer.parseInt(request.getParameter("creds"));
		
		int totRandomBots = Integer.parseInt(request.getParameter("rnds"));
		
		System.out.println("========= INITIALIZING =========");
		
		System.out.println("exportMin="+exportMin);
		
		System.out.println("startingNodeId="+startingNodeId);
		
		System.out.println("startingCredits="+startingCredits);
		
		System.out.println("totRandomBots="+totRandomBots);
		
		BoardMaster boardMaster = BoardMaster.getInstance();
		
		boardMaster.layTheBoard(exportMin);
		
		boardMaster.sitThePlayers(startingNodeId, startingCredits, totRandomBots);
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
