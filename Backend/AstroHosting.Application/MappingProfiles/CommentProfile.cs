using AstroHosting.Application.DTOs.Comment;
using AstroHosting.Core.Entities;
using AutoMapper;

namespace AstroHosting.Application.MappingProfiles
{
    public class CommentProfile : Profile
    {
        public CommentProfile() 
        {
            CreateMap<Comment, CommentDto>()
                .ForMember(dest => dest.CommentDate, opt => opt.MapFrom(src => src.DateCreated));

            CreateMap<CommentCreateDto, Comment>()
                .ForMember(dest => dest.DateCreated, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.DateUpdated, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<CommentUpdateDto, Comment>()
                .ForMember(dest => dest.DateUpdated, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}
