using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using System;
using VDS.RDF;
using VDS.RDF.Writing;
using VDS.RDF.Parsing;

namespace OpenData.API.Domain.Services
{
    public interface IRdfService
    {
        Task<Dataset> import(string url, int categoryId);
        Task<Dataset> populate(int numberOfDatasets);
        Task<Boolean> importCategories(String url);
        void export();
    }
}