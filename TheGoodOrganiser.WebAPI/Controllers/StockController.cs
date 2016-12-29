using Alya.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using TheGoodOrganiser.Core;
using TheGoodOrganiser.DataAccess;

namespace TheGoodOrganiser.WebAPI.Controllers
{
    [RoutePrefix("api/stock")]
    public class StockController : ApiController
    {
        public StockRepository StockRepository { get; set; } = RepositoryFactory.CreateCustom<StockRepository>();

        [Route("")]
        public async Task<IEnumerable<StockItem>> Get()
        {
            var allStocks = await StockRepository.GetAll();
            return allStocks.OrderBy(s => s.Type);
        }

        [HttpGet, HttpPost]
        [Route("AddShoes")]
        public async Task<IHttpActionResult> AddShoes(int amount, int size, Gender gender)
        {
            if(size > 55 || size < 5)
            {
                return NotFound();
            }

            await StockRepository.AddShoesToStock(amount, size, gender);
            return Ok();
        }

        [HttpGet, HttpPost]
        [Route("AddHygiene")]
        public async Task<IHttpActionResult> AddHygiene(int amount)
        {
            await StockRepository.AddHygieneToStock(amount);
            return Ok();
        }

        [HttpGet, HttpPost]
        [Route("AddClothes")]
        public async Task<IHttpActionResult> AddClothes(int amount, StockItemType type, ClothSize size, Gender gender)
        {
            await StockRepository.AddClothsToStock(amount, type, size, gender);
            return Ok();
        }

        [HttpGet, HttpPost]
        [Route("modify")]
        public async Task<IHttpActionResult> ModifyStock(int amount, StockItemType type, ClothSize clothSize, int shoeSize, Gender gender)
        {
           
            await StockRepository.ModifyStock(amount, type, clothSize, shoeSize, gender);
            
            
            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            StockRepository.Dispose();
        }
    }
}
