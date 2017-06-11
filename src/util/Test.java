package util;

import java.util.ArrayList;
import java.util.Collections;

import pattern.Pattern;

public class Test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		Integer a = new Integer(1);		
		Integer b = new Integer(2);		
		Integer c = new Integer(3);
		
		// P1
		
		ArrayList<Integer> list1 = new ArrayList();
		
		list1.add(a);
		list1.add(b);
		list1.add(c);
		
		Pattern pattern1 = new Pattern(list1,true);
		
		// P2
		
		ArrayList<Integer> list2 = new ArrayList();
		
		list2.add(c);
		list2.add(b);
		list2.add(a);		
		
		Pattern pattern2 = new Pattern(list2,true);
		
		ArrayList<Pattern> patterns = new ArrayList<Pattern>();
		
		patterns.add(pattern1);		
		patterns.add(pattern2);
		
		System.out.println("pattern1=pattern2: " + pattern1.equals(pattern2));		
		System.out.println("pattern2=pattern1: " + pattern2.equals(pattern1));
		
		System.out.println("pattern1 index: " + patterns.indexOf(pattern1));
		System.out.println("pattern2 index: " + patterns.indexOf(pattern2));

	}

}
