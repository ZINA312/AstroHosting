using AstroHosting.Application.DTOs.Post;
using AstroHosting.Core.Entities;
using AutoMapper;

namespace AstroHosting.Application.MappingProfiles
{
    public class PostProfile : Profile
    {
        public PostProfile()
        {
            CreateMap<Post, PostDto>()
                .ForMember(dest => dest.LikesCount, opt => opt.MapFrom(src => src.Likes.Count))
                .ForMember(dest => dest.CommentsCount, opt => opt.MapFrom(src => src.Comments.Count))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author));

            CreateMap<Post, PostDetailsDto>()
                .IncludeBase<Post, PostDto>()
                .ForMember(dest => dest.LikedBy, opt => opt.MapFrom(src => src.Likes.Select(l => l.User)))
                .ForMember(dest => dest.EquipmentUsed, opt => opt.MapFrom(src => src.EquipmentUsed.Select(pe => pe.Equipment)));

            CreateMap<PostCreateDto, Post>()
                .ForMember(dest => dest.DateCreated, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.DateUpdated, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<PostUpdateDto, Post>()
                .ForMember(dest => dest.DateUpdated, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.DeletedDate, opt => opt.MapFrom(src => src.IsDeleted ? DateTime.UtcNow : (DateTime?)null));
        }
    }
}
