using AstroHosting.API.ViewModels.Search;
using AstroHosting.Application.DTOs.Search;
using AutoMapper;

namespace AstroHosting.API.MappingProfiles
{
    public class SearchProfile : Profile
    {
        public SearchProfile() 
        {
            CreateMap<SearchResponseVm, SearchResponseDto>();

            CreateMap<SearchResponseDto, SearchResponseVm>();
        }
    }
}
