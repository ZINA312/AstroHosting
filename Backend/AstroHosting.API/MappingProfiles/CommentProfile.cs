using AstroHosting.API.ViewModels.Comment;
using AstroHosting.Application.DTOs.Comment;
using AutoMapper;

namespace AstroHosting.API.MappingProfiles
{
    public class CommentProfile : Profile
    {
        public CommentProfile()
        {
            CreateMap<CommentVm, CommentDto>();

            CreateMap<CommentDto, CommentVm>();

            CreateMap<CommentCreateVm, CommentCreateDto>();
        }
    }
}
