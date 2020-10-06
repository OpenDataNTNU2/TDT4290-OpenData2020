using System.Linq;
using Microsoft.AspNetCore.Mvc;
using OpenData.API.Extensions;
using OpenData.API.Resources;

namespace OpenData.API.Controllers.Config
{
    public static class InvalidModelStateResponseFactory
    {
        public static IActionResult ProduceErrorResponse(ActionContext context)
        {
            var errors = context.ModelState.GetErrorMessages();
            var response = new ErrorResource(messages: errors);
            
            return new BadRequestObjectResult(response);
        }
    }
}