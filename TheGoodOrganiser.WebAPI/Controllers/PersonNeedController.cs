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
    [RoutePrefix("api/need")]
    public class PersonNeedController : ApiController
    {
        public PersonNeedRepository PersonNeedRepository { get; set; } = RepositoryFactory.CreateCustom<PersonNeedRepository>();

        [Route("order/{orderId}")]
        public async Task<IHttpActionResult> GetForOrder(int orderId)
        {
            var needs = await PersonNeedRepository.GetByExpression(n => n.FK_Order == orderId);
            return Ok(needs);
        }

        [HttpPost]
        [Route("insert/{orderId}")]
        public async Task<IHttpActionResult> AddPersonNeed(int orderId, [FromBody] PersonNeed personNeed)
        {
            await PersonNeedRepository.Add(orderId, personNeed);
            return Ok(personNeed);
        }

        [HttpPost]
        [Route("update")]
        public async Task<IHttpActionResult> UpdatePersonNeed([FromBody] PersonNeed personNeed)
        {
            await PersonNeedRepository.Update(personNeed);
            return Ok(personNeed);
        }

        [HttpDelete]
        [Route("delete/{needId}")]
        public async Task<IHttpActionResult> DeletePersonNeed(int needId)
        {
            await PersonNeedRepository.DeleteById(needId);
            return Ok();
        }

    }
}
