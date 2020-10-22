using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;

namespace OpenData.API.Domain.Repositories
{
    public interface INotificationRepository
    {
        Task AddNotificationAsync(Notification notification);
    }
}