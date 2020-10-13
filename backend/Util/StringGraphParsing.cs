using System;
using VDS.RDF;
using VDS.RDF.Writing;
using VDS.RDF.Parsing;


namespace OpenData.API.Util
{
    public class StringGraphParsing
    {
        // Parse graph to string on turtle format
        public static String GraphToStringTurtle(Graph g) 
        {
            CompressingTurtleWriter turtleWriter = new CompressingTurtleWriter();
            return VDS.RDF.Writing.StringWriter.Write(g, turtleWriter);
        }
        // Parse graph to string on xml format
        public static String GraphToStringXml(Graph g) 
        {
            RdfXmlWriter xmlWriter = new RdfXmlWriter();
            return VDS.RDF.Writing.StringWriter.Write(g, xmlWriter);
        }
        // Parse string on turtle format to graph
        public static Graph StringToGraphTurtle(String s) 
        {
            Graph g = new Graph();
            StringParser.Parse(g, s, new TurtleParser());
            return g;
        }
        // Parse string on xml format to graph
        public static Graph StringToGraphXml(String s) 
        {
            Graph g = new Graph();
            StringParser.Parse(g, s, new RdfXmlParser());
            return g;
        }

    }
}