using AutoMapper;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Extensions;
using OpenData.API.Resources;

namespace OpenData.API.Mapping
{
    public class ModelToResourceProfile : Profile
    {
        public ModelToResourceProfile()
        {
            CreateMap<Dataset, DatasetResource>()
                .ForMember(src => src.PublicationStatus,
                            opt => opt.MapFrom(src => src.PublicationStatus.ToDescriptionString()))
                .ForMember(src => src.AccessLevel, opt => opt.MapFrom(src => src.AccessLevel.ToDescriptionString()));

            CreateMap<QueryResult<Dataset>, QueryResultResource<DatasetResource>>();

            CreateMap<Distribution, DistributionResource>()
                .ForMember(src => src.FileFormat,
                           opt => opt.MapFrom(src => src.FileFormat.ToDescriptionString()));

            CreateMap<QueryResult<Distribution>, QueryResultResource<DistributionResource>>();

            CreateMap<User, UserResource>();

            CreateMap<Publisher, PublisherResource>();

            CreateMap<Tags, TagsResource>();

            CreateMap<DatasetTags, DatasetTagsResource>();

            CreateMap<Category, CategoryResource>()
                    .ForMember(src => src.DatasetsCount,
                                opt => opt.MapFrom(src => getDatasetsCount(src)))
                    .ForMember(src => src.CoordinationsCount,
                                opt => opt.MapFrom(src => getCoordinationsCount(src)));

            CreateMap<Coordination, CoordinationResource>();
            CreateMap<CoordinationTags, CoordinationTagsResource>();
            
            CreateMap<QueryResult<Coordination>, QueryResultResource<CoordinationResource>>();
            CreateMap<Application, ApplicationResource>();
            CreateMap<Subscription, SubscriptionResource>();
            CreateMap<Notification, NotificationResource>();

        }

        private int getDatasetsCount(Category category)
        {   
            int sum = category.Datasets.Count;
            foreach(Category nar in category.Narrower)
            {
                sum += getDatasetsCount(nar);
            }
            return sum;
        }
        private int getCoordinationsCount(Category category)
        {   
            int sum = category.Coordinations.Count;
            foreach(Category nar in category.Narrower)
            {
                sum += getCoordinationsCount(nar);
            }
            return sum;
        }
    }
}