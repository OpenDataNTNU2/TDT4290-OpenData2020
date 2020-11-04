using AutoMapper;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Resources;

namespace OpenData.API.Mapping
{
    public class ResourceToModelProfile : Profile
    {
        public ResourceToModelProfile()
        {
            CreateMap<SaveDatasetResource, Dataset>()
                .ForMember(src => src.PublicationStatus, opt => opt.MapFrom(src => (EPublicationStatus)src.PublicationStatus))
                .ForMember(src => src.AccessLevel, opt => opt.MapFrom(src => (EAccessLevel)src.AccessLevel));


            CreateMap<DatasetQueryResource, DatasetQuery>();

            CreateMap<SaveDistributionResource, Distribution>()
                .ForMember(src => src.FileFormat, opt => opt.MapFrom(src => (EFileFormat)src.FileFormat));

            CreateMap<DistributionQueryResource, DistributionQuery>();

            CreateMap<SaveUserResource, User>();

            CreateMap<SavePublisherResource, Publisher>();

            CreateMap<SaveTagsResource, Tags>();

            CreateMap<SaveCategoryResource, Category>();

            CreateMap<SaveCoordinationResource, Coordination>()
                    .ForMember(src => src.AccessLevel, opt => opt.MapFrom(src => (EAccessLevel)src.AccessLevel));
            CreateMap<CoordinationQueryResource, CoordinationQuery>();
            CreateMap<SaveApplicationResource, Application>();
            CreateMap<SaveSubscriptionResource, Subscription>();

        }
    }
}