using AstroHosting.API.ViewModels.User; 
using AstroHosting.API.ViewModels.Post;
using AstroHosting.API.ViewModels.Equipment; 

namespace AstroHosting.API.ViewModels.Search
{
    public class SearchResponseVm
    {
        public IEnumerable<UserShortVm> Users { get; set; } = [];
        public IEnumerable<PostVm> Posts { get; set; } = [];
        public IEnumerable<EquipmentVm> Equipment { get; set; } = [];
    }
}