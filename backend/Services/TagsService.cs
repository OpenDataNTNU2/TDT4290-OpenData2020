using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services;
using OpenData.API.Domain.Repositories;
using OpenData.API.Domain.Services.Communication;

namespace OpenData.API.Services
{
    public class TagsService : ITagsService
    {
        private readonly ITagsRepository _tagsRepository;
        private readonly IUnitOfWork _unitOfWork;
        public TagsService(ITagsRepository tagsRepository, IUnitOfWork unitOfWork){
            _tagsRepository = tagsRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Tags>> ListAsync()
        {
            return await _tagsRepository.ListAsync();
        }

        public async Task<TagsResponse> SaveAsync(Tags tags)
        {
                try
                {
                        await _tagsRepository.AddAsync(tags);
                        await _unitOfWork.CompleteAsync();

                        return new TagsResponse(tags);
                }
                catch(Exception ex)
                {
                        return new TagsResponse($"An error occured when saving the tag: {ex.Message}");
                }
        }

        public async Task<TagsResponse> UpdateAsync(int id, Tags tags)
        {
            var existingTags = await _tagsRepository.FindByIdAsync(id);

            if (existingTags == null)
                return new TagsResponse("tags not found.");

            existingTags.Name = tags.Name;

            try
            {
                _tagsRepository.Update(existingTags);
                await _unitOfWork.CompleteAsync();

                return new TagsResponse(existingTags);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new TagsResponse($"An error occurred when updating the tags: {ex.Message}");
            }   
        }
        public async Task<TagsResponse> DeleteAsync(int id)
        {
            var existingTags = await _tagsRepository.FindByIdAsync(id);

            if (existingTags == null)
                return new TagsResponse("tags not found.");

            try
            {
                _tagsRepository.Remove(existingTags);
                await _unitOfWork.CompleteAsync();

                return new TagsResponse(existingTags);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new TagsResponse($"An error occurred when deleting the tags: {ex.Message}");
            }
        }
    }
}