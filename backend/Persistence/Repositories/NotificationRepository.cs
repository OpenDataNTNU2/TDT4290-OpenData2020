using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Repositories;
using OpenData.API.Persistence.Contexts;
using System.Linq;
using System;

namespace OpenData.API.Persistence.Repositories
{
    public class NotificationRepository : BaseRepository, INotificationRepository
    {
        public NotificationRepository(AppDbContext context) : base(context) { }

        public async Task AddNotificationAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
        }
    }
}