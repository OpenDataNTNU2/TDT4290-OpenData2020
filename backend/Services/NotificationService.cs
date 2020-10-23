using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Repositories;
using OpenData.API.Domain.Services;
using OpenData.API.Domain.Services.Communication;
using OpenData.API.Infrastructure;
using Microsoft.AspNetCore.JsonPatch;

namespace OpenData.API.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public NotificationService(INotificationRepository notificationRepository, IUnitOfWork unitOfWork)
        {
            _notificationRepository = notificationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task AddUserNotificationsAsync(ICatalogueItem catalogueItem, string title, string msg)
        {
            foreach(Subscription subscription in catalogueItem.Subscriptions)
            {
                await AddNotificationAsync(catalogueItem, (int)subscription.UserId, title, msg);
            }
        }

        public async Task AddPublisherNotificationsAsync(ICatalogueItem catalogueItem, string title, string msg)
        {
            foreach(User user in catalogueItem.Publisher.Users)
            {
                await AddNotificationAsync(catalogueItem, user.Id, title, msg);
            }
        }

        private async Task AddNotificationAsync(ICatalogueItem catalogueItem, int userId, string title, string msg)
        {
            Notification notification = new Notification 
            {
                UserId = userId, 
                Title = title,
                Description = msg,
                TimeOfCreation = DateTime.Now,
            };
            if (catalogueItem is Dataset)
            {
                notification.DatasetId = catalogueItem.Id;
            }
            if (catalogueItem is Coordination)
            {
                notification.CoordinationId = catalogueItem.Id;
            }
            
            await _notificationRepository.AddNotificationAsync(notification);
        }
    }
}
