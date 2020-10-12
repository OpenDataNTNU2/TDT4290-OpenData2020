using System;
using VDS.RDF;
using VDS.RDF.Writing;
using VDS.RDF.Parsing;


namespace OpenData.API.Util
{
    public class FileHandling
    {
        // Load RDF content from ttl file
        public static Graph LoadFromFileTurtle(String fileName) 
        {
            Graph g = new Graph();
            TurtleParser ttlParser = new TurtleParser();
            ttlParser.Load(g, fileName);
            return g;
        }
        // Load RDF content from xml file 
        public static Graph LoadFromFileXml(String fileName) 
        {
            Graph g = new Graph();
            RdfXmlParser xmlParser = new RdfXmlParser();
            xmlParser.Load(g, fileName);
            return g;
        }

        // Save RDF content to file as turtle
        public static void SaveToFileTurtle(Graph g, String fileName) 
        {
            CompressingTurtleWriter turtleWriter = new CompressingTurtleWriter();
            turtleWriter.CompressionLevel = 1;
            turtleWriter.Save(g, fileName);
        }

    }
}