package util;

import java.io.Writer;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import com.thoughtworks.xstream.io.json.JsonHierarchicalStreamDriver;
import com.thoughtworks.xstream.io.json.JsonWriter;

public class JsonUtil {

	/**
	 * Serializes an object to JSON.
	 * 
	 * @param obj
	 *            The object that will be serialized.
	 * @return A JSON String.
	 * @throws Exception
	 */
	public static String toJSON(Object obj) throws Exception {

		XStream xstream = new XStream(new JsonHierarchicalStreamDriver() {
			public HierarchicalStreamWriter createWriter(Writer writer) {
				return new JsonWriter(writer, JsonWriter.DROP_ROOT_MODE);
			}
		});

		xstream.setMode(XStream.NO_REFERENCES);

		String jsonText = xstream.toXML(obj);
		return jsonText;
	}

	/**
	 * Serializes an object array to JSON.
	 * 
	 * @param objArray
	 *            The array of objects that will be serialized.
	 * @return A JSON String.
	 * @throws Exception
	 */
	public static String toJSON(Object[] objArray) throws Exception {

		XStream xstream = new XStream(new JsonHierarchicalStreamDriver() {
			public HierarchicalStreamWriter createWriter(Writer writer) {
				return new JsonWriter(writer, JsonWriter.DROP_ROOT_MODE);
			}
		});

		xstream.setMode(XStream.NO_REFERENCES);

		String jsonText = xstream.toXML(objArray);
		return jsonText;
	}

}
