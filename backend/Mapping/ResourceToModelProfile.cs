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
            CreateMap<SaveDatasetResource, Dataset>()
                .ForMember(src => src.PublicationStatus, opt => opt.MapFrom(src => (EPublicationStatus)src.PublicationStatus))
                .ForMember(src => src.DetailedPublicationStatus, opt => opt.MapFrom(src => (EDetailedPublicationStatus)src.DetailedPublicationStatus));

            CreateMap<SaveDistributionResource, Distribution>()
                .ForMember(src => src.FileFormat, opt => opt.MapFrom(src => (EFileFormat)src.FileFormat));

            CreateMap<DistributionQueryResource, DistributionQuery>();

            CreateMap<SaveUserResource, User>();

            CreateMap<SavePublisherResource, Publisher>();
        }
    }
}