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

        public async Task AddUserNotificationsAsync(ICatalogueItem catalogueItem, ICatalogueItem target, string title, string msg)
        {
            foreach(Subscription subscription in catalogueItem.Subscriptions)
            {
                await AddNotificationAsync(target, (int)subscription.UserId, title, msg);
            }
        }

        public async Task AddPublisherNotificationsAsync(ICatalogueItem catalogueItem, ICatalogueItem target, string title, string msg)
        {
            foreach(User user in catalogueItem.Publisher.Users)
            {
                await AddNotificationAsync(target, user.Id, title, msg);
            }
        }

        public async Task AddPublisherNotificationsAsync(Publisher publisher, ICatalogueItem target, string title, string msg)
        {
            foreach(User user in publisher.Users)
            {
                await AddNotificationAsync(target, user.Id, title, msg);
            }
        }

        // Target is what catalogue item the user opens when clicking on the notification
        private async Task AddNotificationAsync(ICatalogueItem target, int userId, string title, string msg)
        {
            Notification notification = new Notification 
            {
                UserId = userId, 
                Title = title,
                Description = msg,
                TimeOfCreation = DateTime.Now,
            };
            if (target is Dataset)
            {
                notification.DatasetId = target.Id;
            }
            if (target is Coordination)
            {
                notification.CoordinationId = target.Id;
            }
            
            await _notificationRepository.AddNotificationAsync(notification);
        }
    }
}
