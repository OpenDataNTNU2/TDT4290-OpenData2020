﻿using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services;
using OpenData.API.Domain.Repositories;
using System;
using System.Collections.Generic;
using VDS.RDF;
using VDS.RDF.Writing;
using VDS.RDF.Parsing;
using System.Linq;
using Newtonsoft.Json.Linq;
using OpenData.API.Util;

namespace OpenData.API.Services
{

    public class RdfService : IRdfService
    {
        
        private readonly IGraphService _graphService;

        public RdfService(IGraphService graphService)
        {
            _graphService = graphService;
        }

        // TODO: De fra data.norge.no har flere format på en distribution?? Skal vi støtte det? :o
        // RART: Finner ikke kategori kobling i rdfene
        // Import dataset from link containing rdf schema. 
        public async Task<Dataset> import(String url)
        {   
            Graph g;
            // Guess the url is actually an url.
            if (url.Contains("/"))
            {   
                // If it is in fellesdatakatalog API we need to request with headers to get on rdf format
                if (url.Contains("fellesdatakatalog.digdir.no"))
                {
                    g = NetworkHandling.LoadFromUriWithHeadersTurtle(url);
                }
                // If the url is directly to the page on data.norge.no fetch with the id
                else if (url.Contains("data.norge.no")){
                    g = NetworkHandling.LoadFromUriWithHeadersTurtle("https://fellesdatakatalog.digdir.no/api/datasets/" + url.Substring(url.LastIndexOf("/")+1));
                }
                // Otherwise hope the url is directly to a rdf file location on XML format
                else 
                {
                    g = NetworkHandling.LoadFromUriXml(url);
                }
            }
            // Guess it is not an url, and instead ID to some dataset in data.norge.no
            else 
            {
                g = NetworkHandling.LoadFromUriWithHeadersTurtle("https://fellesdatakatalog.digdir.no/api/datasets/" + url);
            }

            // Try to parse the dataset and save it in the database
            // Dataset dataset = await _graphService.AddDataset(g);

            

            // return dataset;
            return new Dataset();
        }

        public async Task<Boolean> importCategories(String url)
        {
            Graph g = NetworkHandling.LoadFromUriXml(url);
            return await _graphService.AddCategory(g, null);
        }


        // "https://fellesdatakatalog.digdir.no/api/datasets/e26c5150-7f66-4b0e-a086-27c10f42800f",
        // "https://opencom.no/dataset/58f23dea-ab22-4c68-8c3b-1f602ded6d3e.rdf",
        // Populate the database with datasets from fellesdatakatalog
        public async Task<Dataset> populate(int numberOfDatasets) 
        {
            List<string> urls = findUrlsFromFellesKatalogen(numberOfDatasets);
            Dataset dataset = new Dataset();

            // Parse the content in the urls and add them to the database
            foreach (string url in urls)
            {
                // A small part of the datasets in the fellesdatakatalog does not have a rdf version
                try 
                {
                    dataset = await import(url);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
            return dataset;
        }

        public static int numberOfAddedDatasets = 0;
        // Find urls from felleskatalogen with search on "kommune"
        private List<string> findUrlsFromFellesKatalogen(int numberOfDatasets)   
        {
            List<string> urls = new List<string>();

            // In order to find the first page with new datasets.
            int startPage = (int)(Math.Floor((double)numberOfAddedDatasets/10));
            int stopPage = startPage + (int)(Math.Ceiling((double)numberOfDatasets/10)) + 1;
            // Find the offset if some has been imported before
            int offset = numberOfAddedDatasets % 10;

            // Find new datasets starting on right page
            JArray hits = new JArray();
            for (int i = startPage; i < stopPage; i++)
            {
                JArray newHits = NetworkHandling.LoadFromUrlJson("https://fellesdatakatalog.digdir.no/api/datasets?q=kommune&page=" + i.ToString());
                foreach (JObject dataset in newHits)
                {
                    hits.Add(dataset);
                }
            }

            // Add the urls to the result and increment the static vaiable number of added datasets
            for (int i = offset; i < Math.Min(numberOfDatasets + offset, hits.Count); i++)
            {
                urls.Add("https://fellesdatakatalog.digdir.no/api/datasets/" + (string) hits[i]["_id"]);
                numberOfAddedDatasets++;
            }
            
            return urls;
        }      

        

        public void export() 
        {
            // (in Turtle "a" is a shortcut for the rdf:type predicate)
            // IUriNode rdfType = g.CreateUriNode("rdf:type");
            // IUriNode catalog = g.CreateUriNode(UriFactory.Create("https://www.opendata.no/catalog"));
            // IUriNode dctIdentifier = g.GetUriNode("dct:identifier");
            // IUriNode dcatCatalog = g.GetUriNode("dcat:Catalog");

            // IUriNode dctTitle = g.GetUriNode("dct:title");
            // ILiteralNode catalogTitle = g.CreateLiteralNode("OpenData");

            // IUriNode dctDescription = g.GetUriNode("dct:description");
            // ILiteralNode catalogDescription = g.CreateLiteralNode("OpenData is a data catalog containing open data from municipalities in Norway. Both published and not yet published.");
            
            // g.Assert(new Triple(catalog, dctIdentifier, dcatCatalog));
            // g.Assert(new Triple(catalog, dctTitle, catalogTitle));
            // g.Assert(new Triple(catalog, dctDescription, catalogDescription));


            // IUriNode trondheim = g.CreateUriNode(UriFactory.Create("https://www.opendata.no/agent/trondheim"));
            // IUriNode foafAgent = g.GetUriNode("foaf:Agent");
            // IUriNode foafName = g.GetUriNode("foaf:name");
            // ILiteralNode trondheimName = g.CreateLiteralNode("Trondheim kommune");

            // g.Assert(new Triple(trondheim, dctIdentifier, foafAgent));
            // g.Assert(new Triple(trondheim, foafName, trondheimName));
            
            // IUriNode dctPublisher = g.GetUriNode("dct:publisher");
            // g.Assert(new Triple(catalog, dctPublisher, trondheim));
        }

    }
}