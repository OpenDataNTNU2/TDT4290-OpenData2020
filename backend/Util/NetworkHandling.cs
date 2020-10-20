using System;
using VDS.RDF;
using VDS.RDF.Writing;
using VDS.RDF.Parsing;
using Newtonsoft.Json.Linq;


namespace OpenData.API.Util
{
    public class NetworkHandling
    {
        // Load RDF content from URI
        public static Graph LoadFromUriXml(String uri) 
        {
            Graph g = new Graph();
            UriLoader.Load(g, new Uri(uri), new RdfXmlParser());
            return g;
        }

        // Load RDF content from URI with headers corresponding to turtle
        public static Graph LoadFromUriWithHeadersTurtle(String uri) 
        {
            System.Net.WebRequest req = System.Net.WebRequest.Create(uri);
            // Sets headers to turtle format
            req.Headers["Accept"] = "text/turtle";
            // Sends request and recieves response
            System.Net.WebResponse resp = req.GetResponse();
            // Converts response to string
            System.IO.StreamReader sr = new System.IO.StreamReader(resp.GetResponseStream());
            string result = sr.ReadToEnd().Trim();
            // Parses string to graph
            Graph g = StringGraphParsing.StringToGraphTurtle(result);
            return g;
        }

        // Fetch from a URL as JSON and return hits
        public static JArray LoadFromUrlJson(String uri) 
        {
            System.Net.WebRequest req = System.Net.WebRequest.Create(uri);
            req.Headers["Accept"] = "application/json";
            // Sends request and recieves response
            System.Net.WebResponse resp = req.GetResponse();
            // Converts response to string
            System.IO.StreamReader sr = new System.IO.StreamReader(resp.GetResponseStream());
            string result = sr.ReadToEnd().Trim();

            JObject joResponse = JObject.Parse(result);  
            JObject joObject = (JObject)joResponse["hits"];
            return (JArray)joObject["hits"];
        }
    }
}