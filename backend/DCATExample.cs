using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenData.API.Persistence.Contexts;

using System;
using System.Collections.Generic;
using VDS.RDF;
using VDS.RDF.Writing;
using VDS.RDF.Parsing;

namespace OpenData.API
{

#pragma warning disable CS1591
    public class DCATExample
    {
        public void dcatExample()
        {
            //TEST OMRÅDE START
            // Graph g = new Graph();
            // RdfXmlParser parser = new RdfXmlParser();
            // Load RDF content from URI
            // UriLoader.Load(g, new Uri("https://raw.githubusercontent.com/SEMICeu/DCAT-AP/master/releases/1.1/dcat-ap_1.1.rdf"), parser);

            // CompressingTurtleWriter turtleWriter = new CompressingTurtleWriter();
            // Save RDF content as turtle
            // turtleWriter.Save(g, "dcat-ap_1.1.ttl");

            // To string
            // String data = VDS.RDF.Writing.StringWriter.Write(g, turtleWriter);

            // TripleStore store = new TripleStore();

            IGraph h = new Graph();
            TurtleParser ttlparser = new TurtleParser();
            //Load RDF content from file
            ttlparser.Load(h, "dcat-ap_1.1.ttl");
            // Select some node from URI
            // IUriNode u = h.GetUriNode("dcat:Catalog");
            // Select some triples from node URI
            // IUriNode select = h.CreateUriNode("dcat:Dataset");
            // IEnumerable<Triple> ts = h.GetTriples(select);
            // foreach (Triple t in ts){
            //     Console.WriteLine(t.ToString());
            // }

            Graph g = new Graph();
            ttlparser.Load(g, "dcat_example.ttl");
            IUriNode catalog = g.CreateUriNode(UriFactory.Create("https://www.opendata.no/catalog"));
            IUriNode dctIdentifier = g.GetUriNode("dct:identifier");
            IUriNode dcatCatalog = g.GetUriNode("dcat:Catalog");

            ILiteralNode a = g.CreateLiteralNode("a");

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

            CompressingTurtleWriter turtleWriter = new CompressingTurtleWriter();
            turtleWriter.Save(g, "dcat_example.ttl");


            //TEST OMRÅDE SLUTT
        }

    }
#pragma warning restore CS1591
}