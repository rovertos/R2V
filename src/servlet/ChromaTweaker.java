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
 * Servlet implementation class ChromaTweaker
 */
public class ChromaTweaker extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ChromaTweaker() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		String result = null;
		
		String anomalyNode = request.getParameter("anomaly");
		
		int color = Integer.parseInt(request.getParameter("color"));
		
		System.out.println("========= TWEAKING CHROMA =========");
		
		System.out.println("anomalyNode="+anomalyNode);
		
		System.out.println("color="+color);
		
		BoardMaster boardMaster = BoardMaster.getInstance();
		
		boardMaster.applyAnomaly(anomalyNode, color);
		
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
