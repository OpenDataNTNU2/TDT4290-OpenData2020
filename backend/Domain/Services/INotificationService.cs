using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Services.Communication;
using Microsoft.AspNetCore.JsonPatch;


namespace OpenData.API.Domain.Services

{
    public interface INotificationService
    {
        Task AddUserNotificationsAsync(ICatalogueItem catalogueItem, ICatalogueItem target, string title, string msg);
        Task AddPublisherNotificationsAsync(ICatalogueItem catalogueItem, ICatalogueItem target, string title, string msg);
        Task AddPublisherNotificationsAsync(Publisher publisher, ICatalogueItem target, string title, string msg);
    }
}