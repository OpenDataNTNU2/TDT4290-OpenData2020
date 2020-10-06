using System.Threading.Tasks;

namespace OpenData.API.Domain.Repositories
{
    public interface IUnitOfWork
    {
         Task CompleteAsync();
    }
}