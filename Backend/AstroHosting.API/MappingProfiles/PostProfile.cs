using AstroHosting.API.ViewModels.Post;
using AstroHosting.Application.DTOs.Post;
using AutoMapper;

namespace AstroHosting.API.MappingProfiles
{
    public class PostProfile : Profile
    {
        public PostProfile()
        {
            CreateMap<PostVm, PostDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
                .ForMember(dest => dest.DateCreated, opt => opt.MapFrom(src => DateTime.Parse(src.DateCreated)))
                .ForMember(dest => dest.LikesCount, opt => opt.MapFrom(src => int.Parse(src.LikesCount)))
                .ForMember(dest => dest.CommentsCount, opt => opt.MapFrom(src => int.Parse(src.CommentsCount)))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author));

            CreateMap<PostDto, PostVm>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.DateCreated, opt => opt.MapFrom(src => src.DateCreated.ToString("o")))
                .ForMember(dest => dest.LikesCount, opt => opt.MapFrom(src => src.LikesCount.ToString()))
                .ForMember(dest => dest.CommentsCount, opt => opt.MapFrom(src => src.CommentsCount.ToString()))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author));

            CreateMap<PostDetailsVm, PostDetailsDto>()
                .IncludeBase<PostVm, PostDto>()
                .ForMember(dest => dest.Comments, opt => opt.MapFrom(src => src.Comments))
                .ForMember(dest => dest.LikedBy, opt => opt.MapFrom(src => src.LikedBy))
                .ForMember(dest => dest.EquipmentUsed, opt => opt.MapFrom(src => src.EquipmentUsed));

            CreateMap<PostDetailsDto, PostDetailsVm>()
                .IncludeBase<PostDto, PostVm>()
                .ForMember(dest => dest.Comments, opt => opt.MapFrom(src => src.Comments))
                .ForMember(dest => dest.LikedBy, opt => opt.MapFrom(src => src.LikedBy))
                .ForMember(dest => dest.EquipmentUsed, opt => opt.MapFrom(src => src.EquipmentUsed));

            CreateMap<PostCreateVm, PostCreateDto>()
                .ForMember(dest => dest.EquipmentIds, opt => opt.MapFrom(src =>
                    src.EquipmentIds != null ? src.EquipmentIds.Select(id => Guid.Parse(id)).ToList() : null));

            CreateMap<PostUpdateVm, PostUpdateDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => bool.Parse(src.IsDeleted)));
        }
    }
}
