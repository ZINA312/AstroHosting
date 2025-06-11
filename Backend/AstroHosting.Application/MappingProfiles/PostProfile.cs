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
                .ForMember(dest => dest.DateCreated, opt => opt.MapFrom(src => src.UploadDate))
                .ForMember(dest => dest.LikesCount, opt => opt.MapFrom(src => src.Likes.Count))
                .ForMember(dest => dest.CommentsCount, opt => opt.MapFrom(src => src.Comments.Count));

            CreateMap<Post, PostDetailsDto>()
                .IncludeBase<Post, PostDto>()
                .ForMember(dest => dest.LikedBy, opt => opt.MapFrom(src => src.Likes.Select(l => l.User)));

            CreateMap<PostCreateDto, Post>()
                .ForMember(dest => dest.UploadDate, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<PostUpdateDto, Post>()
                .ForMember(dest => dest.DeletedDate, opt => opt.MapFrom(src => src.IsDeleted ? DateTime.UtcNow : (DateTime?)null));
        }
    }
}
