using System;
using VDS.RDF;
using VDS.RDF.Writing;
using VDS.RDF.Parsing;

namespace Supermarket.API
{

#pragma warning disable CS1591
    public class RdfFileHandler
    {
        // Load RDF content from URI
        public Graph loadFromUriXml(String uri) {
            Graph g = new Graph();
            UriLoader.Load(g, new Uri(uri), new RdfXmlParser());
            return g;
        }

        // Load RDF content from file
        public Graph loadFromFileTurtle(String fileName) {
            Graph g = new Graph();
            TurtleParser ttlparser = new TurtleParser();
            ttlparser.Load(g, fileName);
            return g;
        }

        // Save RDF content to file as turtle
        public void saveToFileTurtle(Graph g, String fileName) {
            CompressingTurtleWriter turtleWriter = new CompressingTurtleWriter();
            turtleWriter.Save(g, fileName);
        }

        public String graphToString(Graph g) {
            CompressingTurtleWriter turtleWriter = new CompressingTurtleWriter();
            return VDS.RDF.Writing.StringWriter.Write(g, turtleWriter);
        }

        
        public void example()
        {   
            Graph dcatAp = loadFromUriXml("https://raw.githubusercontent.com/SEMICeu/DCAT-AP/master/releases/1.1/dcat-ap_1.1.rdf");

            Graph g = loadFromFileTurtle("dcat_example.ttl");

            // Select some node from URI
            // IUriNode u = ex.GetUriNode("dcat:Catalog");
            // Select some triples from node URI
            // IUriNode select = ex.CreateUriNode("dcat:Dataset");
            // IEnumerable<Triple> ts = ex.GetTriples(select);
            // foreach (Triple t in ts){
            //     Console.WriteLine(t.ToString());
            // }


            IUriNode catalog = g.CreateUriNode(UriFactory.Create("https://www.opendata.no/catalog"));
            IUriNode dctIdentifier = g.GetUriNode("dct:identifier");
            IUriNode dcatCatalog = g.GetUriNode("dcat:Catalog");

            IUriNode dctTitle = g.GetUriNode("dct:title");
            ILiteralNode catalogTitle = g.CreateLiteralNode("OpenData");

            IUriNode dctDescription = g.GetUriNode("dct:description");
            ILiteralNode catalogDescription = g.CreateLiteralNode("OpenData is a data catalog containing open data from municipalities in Norway. Both published and not yet published.");
            
            g.Assert(new Triple(catalog, dctIdentifier, dcatCatalog));
            g.Assert(new Triple(catalog, dctTitle, catalogTitle));
            g.Assert(new Triple(catalog, dctDescription, catalogDescription));


            IUriNode trondheim = g.CreateUriNode(UriFactory.Create("https://www.opendata.no/agent/trondheim"));
            IUriNode foafAgent = g.GetUriNode("foaf:Agent");
            IUriNode foafName = g.GetUriNode("foaf:name");
            ILiteralNode trondheimName = g.CreateLiteralNode("Trondheim kommune");

            g.Assert(new Triple(trondheim, dctIdentifier, foafAgent));
            g.Assert(new Triple(trondheim, foafName, trondheimName));
            
            IUriNode dctPublisher = g.GetUriNode("dct:publisher");
            g.Assert(new Triple(catalog, dctPublisher, trondheim));


            saveToFileTurtle(g, "dcat_example.ttl");

        }

    }
#pragma warning restore CS1591
}