using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services;
using OpenData.API.Domain.Repositories;
using OpenData.API.Domain.Services.Communication;
using Microsoft.Extensions.Caching.Memory;
using OpenData.API.Infrastructure;


public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMemoryCache _cache;

    public CategoryService(ICategoryRepository categoryRepository, IUnitOfWork unitOfWork, IMemoryCache cache)
    {
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task<IEnumerable<Category>> ListAsync()
    {
        var categories = await _cache.GetOrCreateAsync(CacheKeys.CategoryList, (entry) => {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
            return _categoryRepository.ListAsync();
        });
        return categories;
    }


    public async Task<CategoryResponse> SaveAsync(Category category)
    {
        try
        {
            await _categoryRepository.AddAsync(category);
            await _unitOfWork.CompleteAsync();

            return new CategoryResponse(category);
        }
        catch (Exception ex)
        {
            // Do some logging stuff
            return new CategoryResponse($"An error occurred when saving the category: {ex.Message}");
        }
    }
}