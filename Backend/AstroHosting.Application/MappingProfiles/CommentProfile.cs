using AstroHosting.Application.DTOs.Comment;
using AstroHosting.Core.Entities;
using AutoMapper;

namespace AstroHosting.Application.MappingProfiles
{
    public class CommentProfile : Profile
    {
        public CommentProfile() 
        {
            CreateMap<Comment, CommentDto>();

            CreateMap<CommentCreateDto, Comment>()
                .ForMember(dest => dest.CommentDate, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}
