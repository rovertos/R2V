package player;

public enum RobotTypes {

	Random(RandomBot.TYPE),
	
	Rush(RushBot.TYPE);

    private final String name;       

    private RobotTypes(String s) {
        name = s;
    }

    public boolean equalsName(String otherName) {
        // (otherName == null) check is not needed because name.equals(null) returns false 
        return name.equals(otherName);
    }

    public String toString() {
       return this.name;
    }
	
}
