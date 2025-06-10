using AstroHosting.API.ViewModels.Post;
using AstroHosting.Application.DTOs.Post;
using AutoMapper;

namespace AstroHosting.API.MappingProfiles
{
    public class PostProfile : Profile
    {
        public PostProfile()
        {
            CreateMap<PostVm, PostDto>();

            CreateMap<PostDto, PostVm>();

            CreateMap<PostDetailsVm, PostDetailsDto>()
                .IncludeBase<PostVm, PostDto>();

            CreateMap<PostDetailsDto, PostDetailsVm>()
                .IncludeBase<PostDto, PostVm>();

            CreateMap<PostCreateVm, PostCreateDto>();

            CreateMap<PostUpdateVm, PostUpdateDto>();
        }
    }
}
