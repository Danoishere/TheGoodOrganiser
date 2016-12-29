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
    [RoutePrefix("api/order")]
    public class OrderController : ApiController
    {
        public OrderRepository OrderRepository { get; set; } = RepositoryFactory.CreateCustom<OrderRepository>();

        public async Task<IEnumerable<Order>> Get()
        {
            return await OrderRepository.GetByExpression(o => o.State != OrderState.Closed);
        }

        public async Task<Order> Get(int id)
        {
            return await OrderRepository.GetById(id);
        }

        [HttpGet]
        [Route("use/{orderId}")]
        public async Task<IHttpActionResult> Use(int orderId)
        {
            try
            { 
                await OrderRepository.MarkOrderAsReadyAndTakeFromStock(orderId);
            }
            catch (Exception e)
            {
                return Ok("Not enough goods to mark as ready");
            }

            return Ok("Ok");
        }

        [HttpGet]
        [Route("close/{orderId}")]
        public async Task<IHttpActionResult> Close(int orderId)
        {
            try
            {
                var order = await OrderRepository.GetById(orderId);
                order.State = OrderState.Closed;
                await OrderRepository.Update(order);
            }
            catch (Exception e)
            {
                return Ok("Not enough goods to mark as ready");
            }

            return Ok("Ok");
        }


        [HttpGet]
        [Route("checkavailability/{orderId}")]
        public async Task<IHttpActionResult> CheckAvailability(int orderId)
        {
            try
            {
                var result = await OrderRepository.CheckAvailability(orderId);
                return Ok(result);
            }
            catch (Exception e)
            {
                throw  e;
            }
        }

        [HttpPost]
        [Route("insert")]
        public async Task<IHttpActionResult> Create([FromBody] Order order)
        {
            order.CreatedOn = DateTime.Now;
            await OrderRepository.Insert(order);
            return Ok(order);
        }

        [HttpPost]
        [Route("update")]
        public async Task<IHttpActionResult> Update([FromBody] Order order)
        {
            await OrderRepository.Update(order);
            return Ok(order);
        }

        [HttpDelete]
        [Route("delete/{orderId}")]
        public async Task<IHttpActionResult> Delete(int orderId)
        {
            await OrderRepository.DeleteById(orderId);
            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            OrderRepository.Dispose();
        }
    }
}