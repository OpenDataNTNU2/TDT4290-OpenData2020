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
                .ForMember(src => src.DetailedPublicationStatus,
                            opt => opt.MapFrom(src => src.DetailedPublicationStatus.ToDescriptionString()))
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
                                opt => opt.MapFrom(src => getCount(src)));

            CreateMap<Coordination, CoordinationResource>();
            
            CreateMap<QueryResult<Coordination>, QueryResultResource<CoordinationResource>>();

        }

        private int getCount(Category category)
        {   
            int sum = category.Datasets.Count;
            foreach(Category nar in category.Narrower)
            {
                sum += getCount(nar);
            }
            return sum;
        }
    }
}