using AstroHosting.API.ViewModels.Comment;
using AstroHosting.Application.DTOs.Comment;
using AutoMapper;

namespace AstroHosting.API.MappingProfiles
{
    public class CommentProfile : Profile
    {
        public CommentProfile()
        {
            CreateMap<CommentVm, CommentDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
                .ForMember(dest => dest.CommentDate, opt => opt.MapFrom(src => DateTime.Parse(src.CommentDate)))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));

            CreateMap<CommentDto, CommentVm>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.CommentDate, opt => opt.MapFrom(src => src.CommentDate.ToString("o")))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));

            CreateMap<CommentCreateVm, CommentCreateDto>()
                .ForMember(dest => dest.PostId, opt => opt.MapFrom(src => Guid.Parse(src.PostId)));
        }
    }
}
