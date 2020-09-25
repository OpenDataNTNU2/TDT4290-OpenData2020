using AutoMapper;
using Supermarket.API.Domain.Models;
using Supermarket.API.Domain.Models.Queries;
using Supermarket.API.Resources;

namespace Supermarket.API.Mapping
{
    public class ResourceToModelProfile : Profile
    {
        public ResourceToModelProfile()
        {
            CreateMap<SaveDatasetResource, Dataset>();

            CreateMap<SaveDistributionResource, Distribution>()
                .ForMember(src => src.FileFormat, opt => opt.MapFrom(src => (EFileFormat)src.FileFormat));

            CreateMap<DistributionQueryResource, DistributionQuery>();
        }
    }
}