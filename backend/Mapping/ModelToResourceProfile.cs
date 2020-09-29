using AutoMapper;
using Supermarket.API.Domain.Models;
using Supermarket.API.Domain.Models.Queries;
using Supermarket.API.Extensions;
using Supermarket.API.Resources;

namespace Supermarket.API.Mapping
{
    public class ModelToResourceProfile : Profile
    {
        public ModelToResourceProfile()
        {
            CreateMap<Dataset, DatasetResource>()
                .ForMember(src => src.PublicationStatus,
                           opt => opt.MapFrom(src => src.PublicationStatus.ToDescriptionString()));

            CreateMap<Distribution, DistributionResource>()
                .ForMember(src => src.FileFormat,
                           opt => opt.MapFrom(src => src.FileFormat.ToDescriptionString()));

            CreateMap<QueryResult<Distribution>, QueryResultResource<DistributionResource>>();

            CreateMap<User, UserResource>();

            CreateMap<Publisher, PublisherResource>();
        }
    }
}